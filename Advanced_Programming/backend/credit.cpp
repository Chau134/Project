#include <string>
#include <fstream>
#include <iostream>
#include <sstream>
#include <vector>
#include <algorithm>
#include <thread>
#include <future>

struct Transaction
{
    std::string date_time;
    int trans_no;
    unsigned long credit;
    int debit;
    std::string detail;
};

std::string toLower(const std::string &s)
{
    std::string result = s;
    std::transform(result.begin(), result.end(), result.begin(), ::tolower);
    return result;
}

std::string removeQuotes(const std::string &s)
{
    std::string result = s;

    // Remove leading quote if present
    if (!result.empty() && result.front() == '"')
    {
        result.erase(result.begin());
    }

    // Remove trailing quote if present
    if (!result.empty() && result.back() == '"')
    {
        result.pop_back();
    }

    return result;
}

std::vector<Transaction> readCSV(const std::string &filename)
{
    std::ifstream file(filename);
    std::string line;
    std::vector<Transaction> data; // Vector to store Transaction structs

    // Check if the file is open
    if (!file.is_open())
    {
        std::cerr << "Error opening file: " << filename << std::endl;
        return data;
    }

    // Skip the first line
    std::getline(file, line);

    // Read each line from the CSV file
    while (std::getline(file, line))
    {
        std::stringstream ss(line);
        std::string value;
        Transaction record; // Create a Transaction struct to hold the data

        // Split the line by commas
        std::getline(ss, value, ','); // Read date_time
        record.date_time = removeQuotes(value);
        std::getline(ss, value, ','); // Read trans_no
        record.trans_no = std::stoi(removeQuotes(value));
        std::getline(ss, value, ','); // Read credit
        record.credit = std::stoul(removeQuotes(value));
        std::getline(ss, value, ','); // Read debit
        record.debit = std::stoi(removeQuotes(value));
        std::getline(ss, value, ','); // Read detail
        record.detail = removeQuotes(value);

        // Add the record to the data vector
        data.push_back(record);
    }

    file.close();

    return data;
}

// std::vector<Transaction> creditSearch(
//     const std::vector<Transaction> &data,
//     unsigned long lower_bound_val,
//     unsigned long upper_bound_val)
// {
//     std::vector<Transaction> results;

//     // Find the iterator to the first element not less than lower_bound_val
//     auto it_lower = std::lower_bound(data.begin(), data.end(), lower_bound_val,
//                                      [](const Transaction &a, int b)
//                                      { return a.credit < b; });
//     // Find the iterator to the first element greater than upper_bound_val
//     auto it_upper = std::upper_bound(data.begin(), data.end(), upper_bound_val,
//                                      [](int a, const Transaction &b)
//                                      { return a < b.credit; });

//     // Iterate from it_lower to it_upper
//     for (auto it = it_lower; it != it_upper; ++it)
//     {
//         results.push_back(*it);
//     }

//     return results;
// }

std::vector<Transaction> detailSearchParallel(const std::string &keyword, std::vector<Transaction> &transactions)
{
    if (keyword == "")
    {
        return transactions;
    }
    std::vector<Transaction> results;
    std::string lowerKeyword = toLower(keyword);

    // Số lượng luồng song song (có thể thay đổi tùy theo số lượng dữ liệu và hệ thống)
    unsigned int numThreads = std::thread::hardware_concurrency();
    unsigned int chunkSize = transactions.size() / numThreads;

    // Mảng để lưu kết quả từ các luồng
    std::vector<std::future<std::vector<Transaction>>> futures;

    // Chia công việc thành các phần nhỏ và thực hiện song song
    for (unsigned int i = 0; i < numThreads; ++i)
    {
        unsigned int start = i * chunkSize;
        unsigned int end = (i == numThreads - 1) ? transactions.size() : (i + 1) * chunkSize;

        // Gửi mỗi phần công việc vào một luồng song song
        futures.push_back(std::async(std::launch::async, [start, end, &transactions, lowerKeyword]()
                                     {
            std::vector<Transaction> localResults;
            for (unsigned int j = start; j < end; ++j)
            {
                // Tìm kiếm trong trường detail
                std::string lowerDetail = toLower(transactions[j].detail);
                if (lowerDetail.find(lowerKeyword) != std::string::npos)
                {
                    localResults.push_back(transactions[j]);
                }
            }
            return localResults; }));
    }

    // Kết hợp kết quả từ tất cả các luồng
    for (auto &future : futures)
    {
        std::vector<Transaction> partialResults = future.get();
        results.insert(results.end(), partialResults.begin(), partialResults.end());
    }

    return results;
}

int main(int argc, char *argv[])
{
    std::string detail_key = argv[1];
    // int lower_key = std::stoul(argv[2]);
    // long upper_key = std::stoul(argv[3]);

    std::string filename = "chuyen_khoan.csv";
    std::vector<Transaction> data = readCSV(filename);

    // std::sort(data.begin(), data.end(), [](const Transaction &a, const Transaction &b)
    //           {
    //               return a.credit < b.credit; // Sort by credit in ascending order
    //           });

    // std::vector<Transaction> temp = creditSearch(data, lower_key, upper_key);
    // std::vector<Transaction> results = detailSearch(detail_key, temp);
    std::vector<Transaction> results = detailSearchParallel(detail_key, data);

    int n = results.size();

    std::cout << "{\"total\": \"" << n << "\", ";

    std::cout
        << "\"records\":["; // Start of JSON array
    for (size_t i = 0; i < n; ++i)
    {
        const Transaction &record = results[i];
        std::cout << "{"
                  << "\"date_time\": \"" << record.date_time << "\", "
                  << "\"trans_no\": " << record.trans_no << ", "
                  << "\"credit\": " << record.credit << ", "
                  << "\"debit\": " << record.debit << ", "
                  << "\"detail\": \"" << record.detail << "\""
                  << "}";
        if (i < n - 1)
            std::cout << ", "; // Add comma if not the last element
    }
    std::cout << "]}";

    return 0;
}

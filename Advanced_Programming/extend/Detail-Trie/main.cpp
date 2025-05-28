#include "Trie.h"
#include <fstream>
#include <iostream>
#include <sstream>
#include <string>
#include <chrono>
#include <filesystem> // Để kiểm tra file tồn tại

void readCSV(const std::string& fileName, Trie& trie) {
    std::ifstream file(fileName);
    if (!file.is_open()) {
        std::cerr << "Cannot open file: " << fileName << std::endl;
        return;
    }

    std::string line;
    while (std::getline(file, line)) {
        std::istringstream ss(line);
        Record record;
        std::getline(ss, record.date_time, ',');
        std::getline(ss, record.trans_no, ',');
        std::getline(ss, record.credit, ',');
        std::getline(ss, record.debit, ',');
        std::getline(ss, record.detail, ',');

        if (!record.date_time.empty() && !record.trans_no.empty() && !record.detail.empty()) {
            trie.insert(record);
        } else {
            std::cerr << "Skipping invalid record: " << line << "\n";
        }
    }

    file.close();
}

int main() {
    Trie trie;

    // Kiểm tra sự tồn tại của file trie_data.bin
    const std::string binFile = "trie_data.bin";
    if (std::filesystem::exists(binFile)) {
        std::cout << "File " << binFile << " found. Loading trie from file...\n";

        // Deserialize trie từ file nhị phân
        std::ifstream ifs(binFile, std::ios::binary);
        if (!ifs.is_open()) {
            std::cerr << "Cannot open file for reading: " << binFile << std::endl;
            return 1;
        }
        trie.deserialize(ifs);
        ifs.close();
        std::cout << "Trie deserialized from " << binFile << "\n";
    } else {
        std::cout << "File " << binFile << " not found. Creating trie from CSV...\n";

        // Đọc CSV và tạo trie
        readCSV("data1.csv", trie);

        // Serialize trie và lưu vào file .bin
        std::ofstream ofs(binFile, std::ios::binary);
        if (!ofs.is_open()) {
            std::cerr << "Cannot open file for writing: " << binFile << std::endl;
            return 1;
        }
        trie.serialize(ofs);
        ofs.close();
        std::cout << "Trie serialized to " << binFile << "\n";

        // Deserialize lại trie sau khi đã lưu vào file
        std::ifstream ifs(binFile, std::ios::binary);
        if (!ifs.is_open()) {
            std::cerr << "Cannot open file for reading after serialization: " << binFile << std::endl;
            return 1;
        }
        trie.deserialize(ifs);
        ifs.close();
        std::cout << "Trie deserialized after serialization.\n";
    }

    // Vòng lặp chính để tìm kiếm liên tục
    std::string userInput;
    while (true) {
        // Hỏi người dùng cách tìm kiếm
        std::cout << "How do you want to search, 0 for exact, 1 for prefix, or type 'exit' to quit: ";
        std::getline(std::cin, userInput);

        // Nếu người dùng nhập 'exit', thoát vòng lặp
        if (userInput == "exit") {
            std::cout << "Exiting the program...\n";
            break;  // Thoát vòng lặp và kết thúc chương trình
        }

        bool searchType = false;
        try {
            searchType = std::stoi(userInput);
        } catch (const std::invalid_argument&) {
            std::cout << "Invalid input. Please enter 0 or 1 for search type.\n";
            continue;
        }

        // Lấy từ khóa tìm kiếm
        std::string keyword;
        std::vector<Record> results;

        if (searchType == 0) {
            std::cout << "Enter keyword to search: ";
            std::getline(std::cin, keyword);

            // Đo thời gian tìm kiếm chính xác
            auto start = std::chrono::high_resolution_clock::now();  // Bắt đầu thời gian

            results = trie.search(keyword);  // Tìm kiếm chính xác

            auto end = std::chrono::high_resolution_clock::now();  // Kết thúc thời gian
            std::chrono::duration<double> duration = end - start;  // Tính độ dài thời gian

            std::cout << "Search completed in: " << duration.count() << " seconds\n";  // Hiển thị thời gian tìm kiếm
        } else if (searchType == 1) {
            std::cout << "Enter prefix to search: ";
            std::getline(std::cin, keyword);

            // Đo thời gian tìm kiếm theo prefix
            auto start = std::chrono::high_resolution_clock::now();  // Bắt đầu thời gian

            results = trie.searchPrefix(keyword);  // Tìm kiếm theo prefix

            auto end = std::chrono::high_resolution_clock::now();  // Kết thúc thời gian
            std::chrono::duration<double> duration = end - start;  // Tính độ dài thời gian

            std::cout << "Search completed in: " << duration.count() << " seconds\n";  // Hiển thị thời gian tìm kiếm
        } else {
            std::cout << "Invalid search type.\n";
            continue;
        }

        // Hiển thị kết quả tìm kiếm
        if (results.empty()) {
            std::cout << "No results found for: " << keyword << "\n";
        } else {
            std::cout << "Results:\n";
            for (const auto& record : results) {
                std::cout << record.date_time << " | " << record.trans_no << " | "
                          << record.credit << " | " << record.debit << " | " << record.detail << "\n";
            }
        }
    }

    return 0;
}
#ifndef TRIE_H
#define TRIE_H

#include <unordered_map>
#include <vector>
#include <memory>
#include <string>
#include <ostream>
#include <istream>

// Struct để lưu bản ghi
struct Record {
    std::string date_time;
    std::string trans_no;
    std::string credit; // Lưu dưới dạng chuỗi
    std::string debit;  // Lưu dưới dạng chuỗi
    std::string detail;
};

// Trie class
class Trie {
    struct TrieNode {
        std::unordered_map<char, std::shared_ptr<TrieNode>> children;
        std::vector<Record> records;
    };

    std::shared_ptr<TrieNode> root;

public:
    Trie();

    void insert(const Record& record);
    std::vector<Record> search(const std::string& keyword);
    std::vector<Record> searchPrefix(const std::string& prefix);
    void serialize(std::ostream& os);
    void deserialize(std::istream& is);

private:
    void searchPrefixHelper(TrieNode* node, std::vector<Record>& result);
    void serializeNode(std::ostream& os, std::shared_ptr<TrieNode> node);
    void deserializeNode(std::istream& is, std::shared_ptr<TrieNode> node);
};

#endif // TRIE_H

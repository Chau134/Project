#include "Trie.h"
#include <iostream>
#include <sstream>

Trie::Trie() : root(std::make_shared<TrieNode>()) {}

void Trie::insert(const Record& record) {
    std::shared_ptr<TrieNode> node = root;
    for (char c : record.detail) {
        if (!node->children[c]) {
            node->children[c] = std::make_shared<TrieNode>();
        }
        node = node->children[c];
    }
    node->records.push_back(record);
}

std::vector<Record> Trie::search(const std::string& keyword) {
    std::shared_ptr<TrieNode> node = root;
    for (char c : keyword) {
        if (!node->children[c]) {
            return {}; // Không tìm thấy
        }
        node = node->children[c];
    }
    return node->records;
}
std::vector<Record> Trie::searchPrefix(const std::string& prefix) {
    auto current = root;
    std::vector<Record> result;

    // Duyệt qua các ký tự trong prefix
    for (char ch : prefix) {
        if (current->children.find(ch) == current->children.end()) {
            return result;  // Không tìm thấy prefix
        }
        current = current->children[ch];
    }

    // Tìm tất cả các bản ghi từ node con chứa prefix này
    searchPrefixHelper(current.get(), result);
    return result;
}

// Hàm trợ giúp để tìm tất cả các bản ghi từ một node trong Trie
void Trie::searchPrefixHelper(TrieNode* node, std::vector<Record>& result) {
    if (node->records.size() > 0) {
        result.insert(result.end(), node->records.begin(), node->records.end());
    }

    // Duyệt qua các nhánh con
    for (auto& child : node->children) {
        searchPrefixHelper(child.second.get(), result);
    }
}

void Trie::serialize(std::ostream& os) {
    serializeNode(os, root);
}

void Trie::deserialize(std::istream& is) {
    root = std::make_shared<TrieNode>();
    deserializeNode(is, root);
}

void Trie::serializeNode(std::ostream& os, std::shared_ptr<TrieNode> node) {
    size_t childrenCount = node->children.size();
    os.write(reinterpret_cast<const char*>(&childrenCount), sizeof(childrenCount));
    for (auto& [key, child] : node->children) {
        os.put(key);
        serializeNode(os, child);
    }
    size_t recordsCount = node->records.size();
    os.write(reinterpret_cast<const char*>(&recordsCount), sizeof(recordsCount));
    for (auto& record : node->records) {
        auto writeString = [&os](const std::string& str) {
            size_t len = str.size();
            os.write(reinterpret_cast<const char*>(&len), sizeof(len));
            os.write(str.data(), len);
        };

        writeString(record.date_time);
        writeString(record.trans_no);
        writeString(record.credit);
        writeString(record.debit);
        writeString(record.detail);
    }
}


void Trie::deserializeNode(std::istream& is, std::shared_ptr<TrieNode> node) {
    size_t childrenCount;
    is.read(reinterpret_cast<char*>(&childrenCount), sizeof(childrenCount));
    for (size_t i = 0; i < childrenCount; ++i) {
        char key = is.get();
        node->children[key] = std::make_shared<TrieNode>();
        deserializeNode(is, node->children[key]);
    }
    size_t recordsCount;
    is.read(reinterpret_cast<char*>(&recordsCount), sizeof(recordsCount));
    for (size_t i = 0; i < recordsCount; ++i) {
        Record record;
        auto readString = [&is](std::string& str) {
            size_t len;
            is.read(reinterpret_cast<char*>(&len), sizeof(len));
            str.resize(len);
            is.read(&str[0], len);
        };

        readString(record.date_time);
        readString(record.trans_no);
        readString(record.credit);
        readString(record.debit);
        readString(record.detail);

        node->records.push_back(record);
    }
}


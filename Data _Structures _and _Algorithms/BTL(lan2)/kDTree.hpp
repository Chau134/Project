#include "main.hpp"
#include "Dataset.hpp"
/* TODO: Please design your data structure carefully so that you can work with the given dataset
 *       in this assignment. The below structures are just some suggestions.
 */
struct kDTreeNode
{
    int label;
    int distance;
    vector<int> data;
    kDTreeNode *left;
    kDTreeNode *right;
    kDTreeNode(vector<int> data, kDTreeNode *left = nullptr, kDTreeNode *right = nullptr, int label = -1)
    {
        this->data = data;
        this->left = left;
        this->right = right;
        this->label = label;
        this->distance = distance;
    }

    friend ostream &operator<<(ostream &os, const kDTreeNode &node)
    {
        os << "(";
        for (int i = 0; i < node.data.size(); i++)
        {
            os << node.data[i];
            if (i != node.data.size() - 1)
            {
                os << ", ";
            }
        }
        os << ")";
        return os;
    }
};

class kDTree
{
private:
    int k;
    kDTreeNode *root;

public:
    kDTree(int k = 2);
    ~kDTree();

    const kDTree &operator=(const kDTree &other);
    kDTree(const kDTree &other);

    void inorderTraversal() const;
    void inorderTraversal(kDTreeNode *node) const;
    void preorderTraversal() const;
    void preorderTraversal(kDTreeNode *node) const;
    void postorderTraversal() const;
    void postorderTraversal(kDTreeNode *node) const;
    int height() const;
    int height(kDTreeNode *node) const;
    int nodeCount() const;
    int nodeCount(kDTreeNode *node) const;
    int leafCount() const;
    int leafCount(kDTreeNode *node) const;
    void insert(const vector<int> &point);
    void insert(kDTreeNode *&node, const vector<int> &point, int len);
    void remove(const vector<int> &point);
    void remove(kDTreeNode *&node, const vector<int> &point, int k, int len);
    bool search(const vector<int> &point);
    void buildTree(const vector<vector<int>> &pointList);
    void buildTree(kDTreeNode *&node, vector<vector<int>> &pointList, int k, int len);
    void buildTree_labled(const vector<vector<int>> &pointList, const vector<int> &labelList);
    void buildTree_labled(kDTreeNode *&node, vector<vector<int>> &pointList, vector<int> &labelList, int k, int len);
    void nearestNeighbour(const vector<int> &target, kDTreeNode *&best);
    void nearestNeighbour(kDTreeNode *node, const vector<int> &target, kDTreeNode *&best, int k, int len);
    void kNearestNeighbour(const vector<int> &target, int k, vector<kDTreeNode *> &bestList);
    void kNearestNeighbour(kDTreeNode *node, const vector<int> &target, int k, vector<kDTreeNode *> &bestList, int len, int size);
    void reHeapUp(vector<kDTreeNode *> &heap, int index);
    void reHeapDown(vector<kDTreeNode *> &heap, int index);
};

class kNN
{
private:
    int k;
    kDTree *tree;

public:
    kNN(int k = 5);
    ~kNN();
    void fit(Dataset &X_train, Dataset &y_train);
    Dataset predict(Dataset &X_test);
    double score(const Dataset &y_test, const Dataset &y_pred);
};

// Please add more or modify as needed
bool compare(const vector<int> &vec1, const vector<int> &vec2);
kDTreeNode *minNode(kDTreeNode *x, kDTreeNode *y, kDTreeNode *z, int axis);
kDTreeNode *searchMin(kDTreeNode *node, int k, int axis, int len);
void merge_labled(vector<vector<int>> &pointList, vector<int> &labelList, int l, int m, int r, int axis);
void mergeSort_labled(vector<vector<int>> &pointList, vector<int> &labelList, int l, int r, int axis);
void merge(vector<vector<int>> &pointList, int l, int m, int r, int axis);
void mergeSort(vector<vector<int>> &pointList, int l, int r, int axis);
int distance(const vector<int> &point1, const vector<int> &point2);
void sortList(vector<kDTreeNode *> &bestList, const vector<int> &target);
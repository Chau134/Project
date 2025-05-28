#include "kDTree.hpp"

/* TODO: You can implement methods, functions that support your data structures here.
 * */
kDTree::kDTree(int k)
{
    this->k = k;
    this->root = nullptr;
}
kDTree::~kDTree()
{
    if (this->root != nullptr) delete this->root;
}
const kDTree &kDTree::operator=(const kDTree &other)
{
    if (this == &other) return *this;
    this->k = other.k;
    this->root = other.root;
    return *this;
}
kDTree::kDTree(const kDTree &other)
{
    this->k = other.k;
    this->root = other.root;
}
void kDTree::inorderTraversal() const
{
    inorderTraversal(this->root);
}
void kDTree::inorderTraversal(kDTreeNode *node) const
{
    if (node == nullptr) return;
    inorderTraversal(node->left);
    cout << *node << " ";
    inorderTraversal(node->right);
}
void kDTree::preorderTraversal() const
{
    preorderTraversal(this->root);
}
void kDTree::preorderTraversal(kDTreeNode *node) const
{
    if (node == nullptr) return;
    cout << *node << " ";
    preorderTraversal(node->left);
    preorderTraversal(node->right);
}
void kDTree::postorderTraversal() const
{
    postorderTraversal(this->root);
}
void kDTree::postorderTraversal(kDTreeNode *node) const
{
    if (node == nullptr) return;
    postorderTraversal(node->left);
    postorderTraversal(node->right);
    cout << *node << " ";
}
int kDTree::height() const
{
    return height(this->root);
}
int kDTree::height(kDTreeNode *node) const
{
    if (node == nullptr) return 0;
    return 1 + max(height(node->left), height(node->right));
}
int kDTree::nodeCount() const
{
    return nodeCount(this->root);
}
int kDTree::nodeCount(kDTreeNode *node) const
{
    if (node == nullptr) return 0;
    return 1 + nodeCount(node->left) + nodeCount(node->right);
}
int kDTree::leafCount() const
{
    return leafCount(this->root);
}
int kDTree::leafCount(kDTreeNode *node) const
{
    if (node == nullptr) return 0;
    if (node->left == nullptr && node->right == nullptr) return 1;
    return leafCount(node->left) + leafCount(node->right);
}
void kDTree::insert(const vector<int> &point)
{
    if (this->k != point.size()) return;
    insert(this->root, point, 0);
}
void kDTree::insert(kDTreeNode *&node, const vector<int> &point, int len)
{
    if (node == nullptr)
    {
        node = new kDTreeNode(point);
        return;
    }
    int axis = len % this->k;
    if (point[axis] < node->data[axis]) insert(node->left, point, len + 1);
    else insert(node->right, point, len + 1);
}
kDTreeNode *minNode(kDTreeNode *x, kDTreeNode *y, kDTreeNode *z, int axis)
{
    kDTreeNode *res = x;
    if (y != nullptr && y->data[axis] < res->data[axis])  res = y;
    if (z != nullptr && z->data[axis] < res->data[axis])  res = z;
    return res;
}
kDTreeNode *searchMin(kDTreeNode *node, int k, int axis, int len)
{
    if (node == nullptr)  return nullptr;
    int currentAxis = len % k;
    if (currentAxis == axis)
    {
        if (node->left == nullptr) return node;
        return searchMin(node->left, k, axis, len + 1);
    }
    return minNode(node, searchMin(node->left, k, axis, len + 1), searchMin(node->right, k, axis, len + 1), axis);
}
bool compare(const vector<int> &v1, const vector<int> &v2)
{
    if (v1.size() != v2.size()) return false;
    for (int i = 0; i < v1.size(); i++) if (v1[i] != v2[i])  return false;
    return true;
}
void kDTree::remove(const vector<int> &point)
{
    remove(this->root, point, this->k, 0);
}
void kDTree::remove(kDTreeNode *&node, const vector<int> &point, int k, int len)
{
    int axis = len % k;
    if (compare(node->data, point))
    {
        if (node->right != nullptr)
        {
            kDTreeNode *min = searchMin(node->right, k, axis, len + 1);
            node->data = min->data;
            remove(node->right, min->data, k, len + 1);
        }
        else if (node->left != nullptr)
        {
            kDTreeNode *min = searchMin(node->left, k, axis, len + 1);
            node->data = min->data;
            remove(node->left, min->data, k, len + 1);
        }
        else
        {
            delete node;
            node = nullptr;
        }
    }
    else if (point[axis] < node->data[axis]) remove(node->left, point, k, len + 1);
    else remove(node->right, point, k, len + 1);
}
bool kDTree::search(const vector<int> &point)
{
    kDTreeNode *current = this->root;
    int depth = 0;
    while (current != nullptr)
    {
        if (current->data == point)
            return true;
        int axis = depth % this->k;
        if (point[axis] < current->data[axis])
            current = current->left;
        else
            current = current->right;
        depth++;
    }
    return false;
}
void merge(vector<vector<int>> &pointList, int left, int middle, int right, int axis)
{
    int n1 = middle - left + 1;
    int n2 = right - middle;
    vector<vector<int>> leftArray(n1);
    vector<vector<int>> rightArray(n2);
    for (int i = 0; i < n1; i++)
        leftArray[i] = pointList[left + i];
    for (int i = 0; i < n2; i++)
        rightArray[i] = pointList[middle + 1 + i];
    int i = 0;
    int j = 0;
    int k = left;
    while (i < n1 && j < n2)
    {
        if (leftArray[i][axis] <= rightArray[j][axis])
        {
            pointList[k] = leftArray[i];
            i++;
        }
        else
        {
            pointList[k] = rightArray[j];
            j++;
        }
        k++;
    }
    while (i < n1)
    {
        pointList[k] = leftArray[i];
        i++;
        k++;
    }
    while (j < n2)
    {
        pointList[k] = rightArray[j];
        j++;
        k++;
    }
}
void mergeSort(vector<vector<int>> &pointList, int left, int right, int axis)
{
    if (left < right)
    {
        int middle = left + (right - left) / 2;
        mergeSort(pointList, left, middle, axis);
        mergeSort(pointList, middle + 1, right, axis);
        merge(pointList, left, middle, right, axis);
    }
}
void merge_labled(vector<vector<int>> &pointList, vector<int> &labelList, int left, int middle, int right, int axis)
{
    int n1 = middle - left + 1;
    int n2 = right - middle;
    vector<vector<int>> leftArray(n1);
    vector<vector<int>> rightArray(n2);
    vector<int> leftLabelArray(n1);
    vector<int> rightLabelArray(n2);
    for (int i = 0; i < n1; i++)
    {
        leftArray[i] = pointList[left + i];
        leftLabelArray[i] = labelList[left + i];
    }
    for (int i = 0; i < n2; i++)
    {
        rightArray[i] = pointList[middle + 1 + i];
        rightLabelArray[i] = labelList[middle + 1 + i];
    }
    int i = 0;
    int j = 0;
    int k = left;
    while (i < n1 && j < n2)
    {
        if (leftArray[i][axis] <= rightArray[j][axis])
        {
            pointList[k] = leftArray[i];
            labelList[k] = leftLabelArray[i];
            i++;
        }
        else
        {
            pointList[k] = rightArray[j];
            labelList[k] = rightLabelArray[j];
            j++;
        }
        k++;
    }
    while (i < n1)
    {
        pointList[k] = leftArray[i];
        labelList[k] = leftLabelArray[i];
        i++;
        k++;
    }
    while (j < n2)
    {
        pointList[k] = rightArray[j];
        labelList[k] = rightLabelArray[j];
        j++;
        k++;
    }
}
void mergeSort_labled(vector<vector<int>> &pointList, vector<int> &labelList, int l, int r, int axis)
{
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort_labled(pointList, labelList, l, m, axis);
    mergeSort_labled(pointList, labelList, m + 1, r, axis);
    merge_labled(pointList, labelList, l, m, r, axis);
}
int distance(const vector<int> &point1, const vector<int> &point2)
{
    int size = point1.size();
    int sum = 0;
    for (int i = 0; i < size; i++) sum += (point1[i] - point2[i]) * (point1[i] - point2[i]);
    return sum;
}
void kDTree::buildTree(const vector<vector<int>> &pointList)
{
    vector<vector<int>> pointListCopy;
    int size = pointList.size();
    this->k = pointList[0].size();
    for (int i = 0; i < size; i++) pointListCopy.push_back(pointList[i]);
    buildTree(this->root, pointListCopy, this->k, 0);
}
void kDTree::buildTree(kDTreeNode *&node, vector<vector<int>> &pointList, int k, int len)
{
    if (pointList.empty()) return;    
    int axis = len % k;
    mergeSort(pointList, 0, pointList.size() - 1, axis);
    int mid = (pointList.size() - 1) / 2;
    node = new kDTreeNode(pointList[mid]);
    vector<vector<int>> leftPointList(pointList.begin(), pointList.begin() + mid);
    vector<vector<int>> rightPointList(pointList.begin() + mid + 1, pointList.end());
    buildTree(node->left, leftPointList, k, len + 1);
    buildTree(node->right, rightPointList, k, len + 1);
}
void kDTree::buildTree_labled(const vector<vector<int>> &pointList, const vector<int> &labelList)
{
    vector<vector<int>> pointListCopy;
    vector<int> labelListCopy;
    int size = pointList.size();
    this->k = pointList[0].size();
    for (int i = 0; i < size; i++)
    {
        pointListCopy.push_back(pointList[i]);
        labelListCopy.push_back(labelList[i]);
    }
    buildTree_labled(this->root, pointListCopy, labelListCopy, this->k, 0);
}
void kDTree::buildTree_labled(kDTreeNode *&node, vector<vector<int>> &pointList, vector<int> &labelList, int k, int len)
{
    if (pointList.empty()) return;
    int axis = len % k;
    mergeSort_labled(pointList, labelList, 0, pointList.size() - 1, axis);
    int mid = (pointList.size() - 1) / 2;
    node = new kDTreeNode(pointList[mid]);
    node->label = labelList[mid];
    vector<vector<int>> leftPointList(pointList.begin(), pointList.begin() + mid);
     vector<vector<int>> rightPointList(pointList.begin() + mid + 1, pointList.end());
    vector<int> leftLabelList(labelList.begin(), labelList.begin() + mid);
    vector<int> rightLabelList(labelList.begin() + mid + 1, labelList.end());
    buildTree_labled(node->left, leftPointList, leftLabelList, k, len + 1);
    buildTree_labled(node->right, rightPointList, rightLabelList, k, len + 1);
}
void kDTree::nearestNeighbour(const vector<int> &target, kDTreeNode *&best)
{
    nearestNeighbour(this->root, target, best, this->k, 0);
}
void kDTree::nearestNeighbour(kDTreeNode *node, const vector<int> &target, kDTreeNode *&best, int k, int len)
{
    if (node == nullptr) return;
    int axis = len % k;
    kDTreeNode *tmp1 = nullptr;
    kDTreeNode *tmp2 = nullptr;
    if (target[axis] >= node->data[axis])
    {
        tmp1 = node->right;
        tmp2 = node->left;
    }
    else
    {
        tmp1 = node->left;
        tmp2 = node->right;
    }
    nearestNeighbour(tmp1, target, best, k, len + 1);
    if (best == nullptr) best = node;
    else
    {
        if (distance(node->data, target) < distance(best->data, target)) best = node;
    }
    if (distance(node->data, target) > abs(target[axis] - node->data[axis]))
    {
        nearestNeighbour(tmp2, target, best, k, len + 1);
    }
}
void sortList(vector<kDTreeNode *> &bestList, const vector<int> &target)
{
    int size = bestList.size();
    int *distanceList = new int[size];
    for (int i = 0; i < size; i++)
    {
        distanceList[i] = distance(bestList[i]->data, target);
    }
    for (int i = 0; i < size; i++)
    {
        for (int j = i + 1; j < size; j++)
        {
            if (distanceList[i] > distanceList[j])
            {
                swap(bestList[i], bestList[j]);
                swap(distanceList[i], distanceList[j]);
            }
        }
    }
    delete[] distanceList;
}
void kDTree::reHeapUp(vector<kDTreeNode *> &bestList, int index)
{
    int p = (index - 1) / 2;
    kDTreeNode *bot = bestList[index];
    while (index > 0 && bestList[p]->distance < bot->distance)
    {
        bestList[index] = bestList[p];
        index = p;
        p = (p - 1) / 2;
    }
    bestList[index] = bot;
}
void kDTree::reHeapDown(vector<kDTreeNode *> &bestList, int index)
{
    kDTreeNode *top = bestList[index];
    int larger;
    int numberOfElements = bestList.size();
    while (index < numberOfElements / 2)
    {
        int l = 2 * index + 1;
        int r = l + 1;
        if (r < numberOfElements && bestList[l]->distance < bestList[r]->distance) larger = r;
        else larger = l;
        if (top->distance >= bestList[larger]->distance) break;
        bestList[index] = bestList[larger];
        index = larger;
    }
    bestList[index] = top;
}
void kDTree::kNearestNeighbour(const vector<int> &target, int k, vector<kDTreeNode *> &bestList)
{
    int size = target.size();
    if (this->k != size) return;
    kNearestNeighbour(this->root, target, k, bestList, 0, size);
    sortList(bestList, target);
}
void kDTree::kNearestNeighbour(kDTreeNode *node, const vector<int> &target, int k, vector<kDTreeNode *> &bestList, int len, int size)
{
    if (node == nullptr) return;
    kDTreeNode *tmp1 = nullptr;
    kDTreeNode *tmp2 = nullptr;
    int axis = len % size;
    if (target[axis] >= node->data[axis])
    {
        tmp1 = node->right;
        tmp2 = node->left;
        
    }
    else
    {
        tmp1 = node->left;
        tmp2 = node->right;
    }
    kNearestNeighbour(tmp1, target, k, bestList, len + 1, size);
    if(bestList.size() < k){
        node->distance = distance(node->data, target);
        bestList.push_back(node);
        reHeapUp(bestList, bestList.size() - 1);
    }
    else{
        node->distance = distance(node->data, target);
        if(node->distance < bestList[0]->distance){

            bestList[0] = bestList[k - 1];
            reHeapDown(bestList, 0);
            bestList[k-1]=node;
            reHeapUp(bestList, k-1);
        }
    }
    if(distance(node->data, target) > abs(target[axis] - node->data[axis])){
        kNearestNeighbour(tmp2, target, k, bestList, len + 1, size);
    }
}
kNN::kNN(int k)
{
    this->k = k;
    this->tree = nullptr;
}
kNN::~kNN()
{
    if (this->tree != nullptr) delete this->tree;
}
void kNN::fit(Dataset &X_train, Dataset &y_train)
{
    int nRows, nCols;
    X_train.getShape(nRows, nCols);
    vector<vector<int>> pointList;
    vector<int> labelList;
    if (tree != nullptr)  delete tree;
    for (const auto &inner_list : X_train.data)
    {
        vector<int> inner_vec(inner_list.begin(), inner_list.end());
        pointList.push_back(inner_vec);
    }
    for (const auto &inner_list : y_train.data)
    {
        vector<int> inner_vec(inner_list.begin(), inner_list.end());
        labelList.push_back(inner_vec[0]);
    }
    this->tree = new kDTree(nCols);
    this->tree->buildTree_labled(pointList, labelList);
}
Dataset kNN::predict(Dataset &X_test)
{
    int nRows, nCols;
    X_test.getShape(nRows, nCols);
    Dataset res;
    res.columnName = {"label"};
    int pred_label[10], max = 0;
    vector<vector<int>> pointList;
    for (const auto &inner_list : X_test.data)
    {
        vector<int> inner_vec(inner_list.begin(), inner_list.end());
        pointList.push_back(inner_vec);
    }
    for (int i = 0; i < nRows; i++)
    {
        vector<kDTreeNode *> bestList;
        this->tree->kNearestNeighbour(pointList[i], this->k, bestList);
        for (int j = 0; j < 10; j++) pred_label[j] = 0;
        for (int j = 0; j < this->k; j++) pred_label[bestList[j]->label]++;
        for (int j = 0; j < 10; j++) if (pred_label[j] > pred_label[max]) max = j;
        res.data.push_back({max});
    }
    return res;
}
double kNN::score(const Dataset &y_test, const Dataset &y_pred)
{
    int nRows, nCols, count = 0;
    y_test.getShape(nRows, nCols);
    vector<vector<int>> y_test_data;
    vector<vector<int>> y_pred_data;
    for (const auto &inner_list : y_test.data)
    {
        vector<int> inner_vec(inner_list.begin(), inner_list.end());
        y_test_data.push_back(inner_vec);
    }
    for (const auto &inner_list : y_pred.data)
    {
        vector<int> inner_vec(inner_list.begin(), inner_list.end());
        y_pred_data.push_back(inner_vec);
    }
    for (int i = 0; i < nRows; i++) if (y_test_data[i][0] == y_pred_data[i][0])  count++;
    return (double)count / nRows;
}
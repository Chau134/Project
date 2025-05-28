#include "kNN.hpp"

/* TODO: You can implement methods, functions that support your data structures here.
 * */
template<typename T>
ArrayList<T>::ArrayList() 
{
    head = tail = nullptr;
    count = 0;
}
template<typename T>
ArrayList<T>::~ArrayList()
{
    clear();
}
template<typename T>
void ArrayList<T>::push_back(T value)
{
    Node* pNew = new Node(value, nullptr);
    if (count == 0) head = tail = pNew;
    else 
    {
        tail->next = pNew;
        tail = pNew;
    }
    count++;
}
template<typename T>
void ArrayList<T>::push_front(T value) 
{
    Node* pNew = new Node(value, nullptr);
    if (count == 0) head = tail = pNew;
    else 
    {
        pNew->next = head;
        head = pNew;
    }
    count++;
}
template<typename T>
void ArrayList<T>::insert(int index, T value) {
    if (index < 0 || index > count)  return;
    Node* pNew = new Node(value, nullptr);
    if (head == nullptr) head = tail = pNew;
    else if (index == 0) 
    {
        pNew->next = head;
        head = pNew;
    }
    else if (index == count) 
    {
        tail->next = pNew;
        tail = pNew;
    }
    else 
    {
        Node* current = head;
        for (int i = 0; i < index - 1; i++) current = current->next;
        pNew->next = current->next;
        current->next = pNew;
    }
    count++;
}
template<typename T>
void ArrayList<T>::remove(int index)
{
    if (index < 0 || index >= count)  return;
    Node* tmp = head;
    if (index == 0) 
    {
        head = head->next;
        delete tmp;
    }
    else if (index == count - 1)
    {
        for (Node* k = head; k != NULL; k = k->next)
        {
            if (k->next == tail)
            {
                delete tail;
                k->next = NULL;
                tail = k;
                break;
            }
        }

    }
    else 
    {
        Node* cur = head;
        for (int i = 0; i < index - 1; i++) cur = cur->next;
        tmp = cur->next;
        cur->next = tmp->next;
        delete tmp;
    }
    count--;
}
template<typename T>
T& ArrayList<T>::get(int index) const {
    if (index < 0 || index >= count) throw std::out_of_range("get(): Out of range");
    Node* tmp = head;
    for (int i = 0; i < index; i++)  tmp = tmp->next;
    return tmp->data;
}
template<typename T>
int ArrayList<T>::length() const 
{
    return count;
}
template<typename T>
void ArrayList<T>::clear() 
{
    Node* current = head;
    while (current != NULL) 
    {
        Node* next = current->next;
        delete current;
        current = next;
    }
    head = tail = NULL;
    count = 0;

}
template<typename T>
void ArrayList<T>::print() const
{
    Node* tmp = head;
    for (int i = 0; i < count; i++)
    {
        cout << tmp->data;
        tmp = tmp->next;
        if (i != count - 1) cout << " ";
    }
}
template<typename T>
void ArrayList<T>::reverse() {
    tail = head;
    Node* prev = nullptr;
    Node* nextNode = nullptr;
    Node* cur = head;
    while (cur != nullptr) 
    {
        nextNode = cur->next;
        cur->next = prev;
        prev = cur;
        cur = nextNode;
    }
    head = prev;
}
Dataset::Dataset() 
{
    NameCols = new ArrayList<string>();
    data = new ArrayList<List<int>*>();
    Rows = 0;
    Cols = 0;
}
Dataset::~Dataset() 
{
  
}
Dataset::Dataset(const Dataset& other) 
{
    other.getShape(Rows, Cols); 
    NameCols = new ArrayList<string>();
    for (int i = 0; i < Cols; i++)
    {
        NameCols->push_back(other.getNameCols()->get(i));
    }
    data = new ArrayList<List<int>*>();
    for (int i = 0; i < Rows; i++) 
    {
        List<int>* row = new ArrayList<int>();
        for (int j = 0; j < Cols; j++) 
        {
            row->push_back(other.data->get(i)->get(j)); 
        }
        data->push_back(row); 
    }

}
Dataset& Dataset::operator=(const Dataset& other) 
{
    data = other.getData();
    NameCols = other.NameCols;
    other.getShape(Rows, Cols);
    return *this;
}
bool Dataset::loadFromCSV(const char* fileName) 
{
    ifstream f;
    f.open(fileName);
    if (!f.is_open())  return false; 
    string s; int n;
    for (int i = 0; i < 784; i++)
    {
        getline(f, s, ',');
        NameCols->push_back(s);
    }
    getline(f, s);
    NameCols->push_back(s);
    for (int i = 0; i < 199; i++) 
    {
        data->push_back(new ArrayList<int>());
        for (int j = 0; j < 784; j++) 
        {
            getline(f, s, ',');
            n = stoi(s);
            data->get(i)->push_back(n);
        }
        getline(f, s);
        n = stoi(s);
        data->get(i)->push_back(n);
    }
    f.close();
    Rows = data->length();
    Cols = data->get(0)->length();
    return true;
}
void Dataset::printHead(int nRows, int nCols) const 
{
    if (nRows <= 0 || nCols <= 0)  return;
    int rows = 0, cols = 0;
    getShape(rows, cols);
    if (nRows < rows)  rows = nRows;
    if (nCols < cols) cols = nCols;
    for (int i = 0; i < cols; i++)
    {
        cout << NameCols->get(i);
        (i != cols - 1)? cout << " ": cout << endl;
    }
    for (int i = 0; i < rows; i++) 
    {
        for (int j = 0; j < cols; j++) 
        {
            cout << data->get(i)->get(j);
            if (j != cols - 1) cout << " ";
        }
        if (i != rows - 1) cout << endl;
    }
}
void Dataset::printTail(int nRows, int nCols) const
{
   
    if (nRows <= 0 || nCols <= 0)  return;
    int rows = 0, cols = 0;
    getShape(rows, cols);
    if (nRows < rows)  rows = nRows;
    if (nCols < cols) cols = nCols;
    int Rows, Cols;
    getShape(Rows, Cols);
    for (int i = Cols - cols; i < Cols; i++) 
    {
        cout << NameCols->get(i);
        (i != Cols - 1) ? cout << " " : cout << endl;
    }
    for (int i = Rows - rows; i < Rows; i++) 
    {
        for (int j = Cols - cols; j < Cols; j++)
        {
            cout << data->get(i)->get(j);
            if (j != Cols - 1)cout << " ";
        }
        if (i != Rows - 1)cout << endl;
    }
}
void Dataset::getShape(int& nRows, int& nCols) const 
{
    nRows = Rows;
    nCols = Cols;
}
void Dataset::columns() const
{
    NameCols->print();
}
bool Dataset::drop(int axis, int index, std::string columns)
{
    if (axis == 0) 
    {
        if (index >= Rows || index < 0) return false;
        this->data->remove(index);
        Rows--;
        return true;
    }
    else if (axis == 1)
    {
        int colIdx = -1;
        for (int i = 0; i < Cols; i++)
        {
            string namecol = NameCols->get(i);
            if (namecol.compare(columns) == 0)
            {
                colIdx = i;
                break;
            }
        }
        if (colIdx == -1) return false;
        for (int i = 0; i < Rows; i++) 
        {
            data->get(i)->remove(colIdx);
        }
        return true;
    }
    return false;
}
void Dataset::setShape()
{
    Rows = data->length();
    Cols = data->get(0)->length();
}
Dataset Dataset::extract(int startRow, int endRow, int startCol, int endCol) const
{
    if(startRow<0|| endRow<=-2|| startCol<0|| endCol<=-2) throw std::out_of_range("get(): Out of range");
    if (((startRow > endRow )&& endRow!=-1)|| ((startCol > endCol)&&endCol!=-1)) throw std::out_of_range("get(): Out of range");
    if (endRow == -1 || endRow >= Rows) endRow = Rows - 1;
    if (endCol == -1 || endCol >= Cols) endCol = Cols - 1;
    Dataset eTable;
    List<string>* ename = new ArrayList<string>();
    List<List<int>*>* edata = new ArrayList<List<int>*>();
    int erows = 0, ecols = 0;
    for (int i = startRow; i <= endRow; i++)
    {
        ArrayList<int>* erow = new ArrayList<int>();
        for (int j = startCol; j <= endCol; j++) erow->push_back(data->get(i)->get(j));
        edata->push_back(erow);
        erows++;
    }
    for (int j = startCol; j <= endCol; j++)
    {
        ename->push_back(NameCols->get(j));
        ecols++;
    }
    eTable.data = edata;
    eTable.NameCols = ename;
    eTable.Cols = ecols;
    eTable.Rows = erows;
    return eTable;
}
List<List<int>*>* Dataset::getData() const
{
    return data;
}
List<string>* Dataset::getNameCols() const
{
    return NameCols;
}
kNN::kNN(int k) 
{
    this->k = k;
}
void kNN::fit(const Dataset& X_train, const Dataset& y_train) 
{
    this->X_train = X_train;
    this->y_train = y_train;
}
Dataset kNN::predict(const Dataset& X_test)
{
    Dataset result = Dataset();
    List<List<int>*>* feature = result.getData();
    List<string>* label = result.getNameCols();   label->push_back("label");
    int rowsTest = 0, colsTest = 0, rowsTrain = y_train.getData()->length();
    X_test.getShape(rowsTest, colsTest);
    int** distances2 = new int* [rowsTest];// tạo mảng chứa kq khoảng cách, hàng: ảnh, côt: train
    List<List<int>*>* DataTrain = X_train.getData();
    List<List<int>*>* DataTest = X_test.getData();
    for (int i = 0; i < rowsTest; i++)
    {  
        distances2[i] = new int[rowsTrain];
        List<int>* ImagesTest = DataTest->get(i);
        for (int j = 0; j < rowsTrain; j++)
        {
            List<int>* ImagesTrain = DataTrain->get(j);
            int distance = 0;
            for (int h = 0; h < 784; h++) 
            {
                distance = distance + pow(ImagesTest->get(h) - ImagesTrain->get(h), 2);
            }
            distances2[i][j] = distance;
        }
    }
    int** labelTest = new int* [rowsTest]; // bảng label của all ảnh, bd = 0
    for (int i = 0; i < rowsTest; i++)
    {
        labelTest[i] = new int[10];
        for (int j = 0; j < 10; j++)
        {
            labelTest[i][j] = 0;
        }
    }
    int* labelTrain = new int[rowsTrain]; // khỏi tạo bảng label y_train
    for (int i = 0; i < rowsTest; i++)
    {
        for (int j = 0; j < rowsTrain; j++) labelTrain[j] = y_train.getData()->get(j)->get(0);
        for (int h = 0; h < k; h++) 
        {
            int min = distances2[i][h]; 
            int minIdx = h;
            for (int j = h; j < rowsTrain; j++)
            {
                if (distances2[i][j] < min)
                {
                    min = distances2[i][j];
                    minIdx = j;
                }
            }
            distances2[i][minIdx] = distances2[i][h];
            distances2[i][h] = min;  
            int tmp = labelTrain[minIdx];
            labelTrain[minIdx] = labelTrain[h];
            labelTrain[h] = tmp;
            ++labelTest[i][labelTrain[h]];
        }
    }
    for (int i = 0; i < rowsTest; i++) 
    {
        int label = labelTest[i][0], labelIdx = 0;
        for (int j = 1; j < 10; j++) 
        {
            if (labelTest[i][j] > label)
            {
                label = labelTest[i][j];
                labelIdx = j;
            }
        }
        feature->push_back(new ArrayList<int>());
        feature->get(i)->push_back(labelIdx);
    }
    for (int i = 0; i < rowsTest; i++) delete[] distances2[i];
    delete[] distances2; distances2 = nullptr;
    for (int i = 0; i < rowsTest; i++) delete[] labelTest[i];
    delete[] labelTest; labelTest = nullptr;
    delete[] labelTrain; labelTrain = nullptr;
    result.setShape();
    return result;
}
double kNN::score(const Dataset& y_test, const Dataset& y_pred)
{
    List<List<int>*>* test = y_test.getData();
    List<List<int>*>* pred = y_pred.getData();
    int T = 0, F = 0; 
    for (int i = 0; i < test->length(); i++) 
    {
        if (test->get(i)->get(0) == pred->get(i)->get(0))  T++;
        else F++;
    }
    double result = static_cast<double> (T) / (T + F);
    return result;
}
void train_test_split(Dataset& X, Dataset& y, double test_size,
    Dataset& X_train, Dataset& X_test, Dataset& y_train, Dataset& y_test) 
{
    int rows = 0; int cols = 0;
    y.getShape(rows, cols);
    int nTrain = rows - rows * test_size;
    int nTest = rows - nTrain;
    X_train = X.extract(0, rows - nTest - 1, 0, -1);
    X_test = X.extract(rows - nTest, -1, 0, -1);
    y_train = y.extract(0, rows - nTest - 1, 0, 0);
    y_test = y.extract(rows - nTest, -1, 0, 0);

}

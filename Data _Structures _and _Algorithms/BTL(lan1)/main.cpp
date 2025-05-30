#include "kNN.hpp"

void tc1() {
    /*int nrows, ncols;
    dataset dataset;
    dataset.loadfromcsv("mnist.csv");
    dataset dataset_extract = dataset.extract(0, -2, 0, -1);
    dataset dataset_extract2 = dataset_extract;
    dataset_extract2.getshape(nrows, ncols);
    cout << "dataset extract shape: " << nrows << "x" << ncols << endl;*/
    //tc_knn_score(10, 10);
   /* Dataset dataset;
    dataset.loadFromCSV("mnist.csv");
    dataset.printHead();*/
   /* Dataset dataset;
    dataset.loadFromCSV("mnist.csv");
    dataset.printHead();
    dataset.printTail();
    int nRows, nCols;
    dataset.getShape(nRows, nCols);
    cout << "Shape: " << nRows << "x" << nCols << endl;

    kNN knn;
    Dataset X_train, X_test, y_train, y_test;
    Dataset feature = dataset.extract(0, -1, 1, -1);
    Dataset label = dataset.extract(0, -1, 0, 0);
    train_test_split(feature, label, 0.2, X_train, X_test, y_train, y_test);*/
   // X_test.printTail(20, 30);
    /*knn.fit(X_train, y_train);
    Dataset y_pred = knn.predict(X_test);
    double accuracy = knn.score(y_test, y_pred);
    cout << "Accuracy: " << accuracy << endl;*/
    Dataset dataset;
    dataset.loadFromCSV("mnist.csv");
    int nRows, nCols;
    dataset.getShape(nRows, nCols);
    dataset.printHead();
    dataset.printTail();
    kNN knn;
    Dataset X_train, X_test, y_train, y_test;
    Dataset feature = dataset.extract(0, -1, 1, -1);
    Dataset label = dataset.extract(0, -1, 0, 0);

    train_test_split(feature, label, 0.2, X_train, X_test, y_train, y_test);
    knn.fit(X_train, y_train);
    Dataset y_pred = knn.predict(X_test);
    y_pred.printHead();
    double accuracy = knn.score(y_test, y_pred);
    cout << "Accuracy: " << accuracy << endl;

}

int main() {
    tc1();
    return 0;
}
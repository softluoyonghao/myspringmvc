'use strict';

/**
 * StoreController
 * @constructor
 */
var StoreController = function($scope, $http) {
    $scope.store = {};
    $scope.editMode = false;

    $scope.fetchStoresList = function() {
        $http.get('stores/storesList.json').success(function(storeList){
            $scope.stores = storeList;
        });
    };

    $scope.addNewStore = function(store) {
        $scope.resetError();

        $http.post('stores/addStore', store).success(function() {
            $scope.fetchStoresList();
            $scope.store.storeName = '';
            $scope.store.storeName = '';
            $scope.store.diesel = false;
        }).error(function() {
            $scope.setError('Could not add a new store');
        });
    };

    $scope.updatestore = function(store) {
        $scope.resetError();

        $http.put('stores/updatestore', store).success(function() {
            $scope.fetchstoresList();
            $scope.store.name = '';
            $scope.store.speed = '';
            $scope.store.diesel = false;
            $scope.editMode = false;
        }).error(function() {
            $scope.setError('Could not update the store');
        });
    };

    $scope.editstore = function(store) {
        $scope.resetError();
        $scope.store = store;
        $scope.editMode = true;
    };

    $scope.removestore = function(id) {
        $scope.resetError();

        $http.delete('stores/removestore/' + id).success(function() {
            $scope.fetchstoresList();
        }).error(function() {
            $scope.setError('Could not remove store');
        });
        $scope.store.name = '';
        $scope.store.speed = '';
    };

    $scope.removeAllstores = function() {
        $scope.resetError();

        $http.delete('stores/removeAllstores').success(function() {
            $scope.fetchstoresList();
        }).error(function() {
            $scope.setError('Could not remove all stores');
        });

    };

    $scope.resetstoreForm = function() {
        $scope.resetError();
        $scope.store = {};
        $scope.editMode = false;
    };

    $scope.resetError = function() {
        $scope.error = false;
        $scope.errorMessage = '';
    };

    $scope.setError = function(message) {
        $scope.error = true;
        $scope.errorMessage = message;
    };

    $scope.fetchStoresList();

    $scope.predicate = 'id';
};
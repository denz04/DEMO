var app = angular.module('xmlReader', ['ui.bootstrap','ui.grid', 'ui.grid.selection']);
app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
            	var reader = new FileReader();

                reader.onload = function(e){
                    var data = e.target.result;
                    var workbook = XLSX.read(data, {type : 'binary'});

                    workbook.SheetNames.forEach(function(sheetName){
                        // Here is your object
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        var json_object = JSON.stringify(XL_row_object);
                        console.log(json_object);
						scope.$apply(function () {
                        scope.fileread = XL_row_object;
                    });

                    })

                };

                reader.onerror = function(ex){
                    console.log(ex);
                };

                reader.readAsBinaryString(changeEvent.target.files[0]);
            });
        }
    }
}]);
app.controller('parser', function($scope) {
	$scope.skipArray =[]; 
	$scope.excelGrid ={
			enableRowSelection: true,
		    enableSelectAll: true,
		    selectionRowHeaderWidth: 35,
		    enableGroupHeaderSelection: false,
		    multiSelect : true,
		 columnDefs: [
		              { name: 'name1',field : 'SNO',displayName : 'SNO' },
		              { name: 'name2',field : 'NAME',displayName : 'NAME' },
		              { name: 'name3',field : 'ADDRESS',displayName : 'ADDRESS' },
		              { name: 'name4',field : 'CONTACT',displayName : 'CONTACT' },
		            ],
		            onRegisterApi: function( gridApi ) {
		                $scope.excelGridApi = gridApi;
		                gridApi.selection.on.rowSelectionChanged($scope, function(row){ 
		                	$scope.skipArray.push(row.entity.SNO);
		                    });
		            }
};
	
$scope.readFile = function(){
	$scope.excelGrid.data =$scope.fileName;
};	
$scope.upload = function(){
	var uploadArray = [];
	for(var i=0 ;i<$scope.excelGrid.data.length;i++){
		for(var j=0 ;j<$scope.skipArray.length;j++){
		if($scope.excelGrid.data[i].SNO != $scope.skipArray[j])
			uploadArray.push($scope.excelGrid.data[i]);
		}
	}
	
};


   

});
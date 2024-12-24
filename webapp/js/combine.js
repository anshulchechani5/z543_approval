// external.js
var externalData = {
    key1: 'value1',
    key2: 'value2'
};

function getExternalData() {
    return externalData;
}
function oBackendServiceData(entitySet, ServiceModel){
    return new Promise(function (resolve, reject) {
        ServiceModel.read(entitySet, {
            success: function (data) {
                resolve(data.results);
            },
            error: function (error) {
                oBusy.close();
                console.error("Error fetching data from " + entitySet + ":", error);
                reject(error); // Reject the Promise with the encountered error
            }
        });
    });
}
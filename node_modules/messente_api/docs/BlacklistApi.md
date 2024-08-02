# MessenteApi.BlacklistApi

All URIs are relative to *https://api.messente.com/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addToBlacklist**](BlacklistApi.md#addToBlacklist) | **POST** /phonebook/blacklist | Adds a phone number to the blacklist
[**deleteFromBlacklist**](BlacklistApi.md#deleteFromBlacklist) | **DELETE** /phonebook/blacklist/{phone} | Deletes a phone number from the blacklist
[**fetchBlacklist**](BlacklistApi.md#fetchBlacklist) | **GET** /phonebook/blacklist | Returns all blacklisted phone numbers
[**isBlacklisted**](BlacklistApi.md#isBlacklisted) | **GET** /phonebook/blacklist/{phone} | Checks if a phone number is blacklisted


<a name="addToBlacklist"></a>
# **addToBlacklist**
> addToBlacklist(numberToBlacklist)

Adds a phone number to the blacklist

### Example
```javascript
var MessenteApi = require('messente_api');
var defaultClient = MessenteApi.ApiClient.instance;

// Configure HTTP basic authorization: basicAuth
var basicAuth = defaultClient.authentications['basicAuth'];
basicAuth.username = 'YOUR USERNAME';
basicAuth.password = 'YOUR PASSWORD';

var apiInstance = new MessenteApi.BlacklistApi();
var numberToBlacklist = {"phoneNumber":"+37251000000"}; // NumberToBlacklist | Phone number to be blacklisted
var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.addToBlacklist(numberToBlacklist, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **numberToBlacklist** | [**NumberToBlacklist**](NumberToBlacklist.md)| Phone number to be blacklisted | 

### Return type

null (empty response body)

### Authorization

[basicAuth](../README.md#basicAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="deleteFromBlacklist"></a>
# **deleteFromBlacklist**
> deleteFromBlacklist(phone)

Deletes a phone number from the blacklist

### Example
```javascript
var MessenteApi = require('messente_api');
var defaultClient = MessenteApi.ApiClient.instance;

// Configure HTTP basic authorization: basicAuth
var basicAuth = defaultClient.authentications['basicAuth'];
basicAuth.username = 'YOUR USERNAME';
basicAuth.password = 'YOUR PASSWORD';

var apiInstance = new MessenteApi.BlacklistApi();
var phone = +37251000000; // String | A phone number
var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.deleteFromBlacklist(phone, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **phone** | **String**| A phone number | 

### Return type

null (empty response body)

### Authorization

[basicAuth](../README.md#basicAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="fetchBlacklist"></a>
# **fetchBlacklist**
> FetchBlacklistSuccess fetchBlacklist()

Returns all blacklisted phone numbers

### Example
```javascript
var MessenteApi = require('messente_api');
var defaultClient = MessenteApi.ApiClient.instance;

// Configure HTTP basic authorization: basicAuth
var basicAuth = defaultClient.authentications['basicAuth'];
basicAuth.username = 'YOUR USERNAME';
basicAuth.password = 'YOUR PASSWORD';

var apiInstance = new MessenteApi.BlacklistApi();
var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.fetchBlacklist(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**FetchBlacklistSuccess**](FetchBlacklistSuccess.md)

### Authorization

[basicAuth](../README.md#basicAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="isBlacklisted"></a>
# **isBlacklisted**
> isBlacklisted(phone)

Checks if a phone number is blacklisted

### Example
```javascript
var MessenteApi = require('messente_api');
var defaultClient = MessenteApi.ApiClient.instance;

// Configure HTTP basic authorization: basicAuth
var basicAuth = defaultClient.authentications['basicAuth'];
basicAuth.username = 'YOUR USERNAME';
basicAuth.password = 'YOUR PASSWORD';

var apiInstance = new MessenteApi.BlacklistApi();
var phone = +37251000000; // String | A phone number
var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.isBlacklisted(phone, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **phone** | **String**| A phone number | 

### Return type

null (empty response body)

### Authorization

[basicAuth](../README.md#basicAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


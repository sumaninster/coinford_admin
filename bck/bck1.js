formatOrderList(OrderList, callback) {
  var AllCurrencies = this.AllCurrencies;
  OrderList.forEach(function(value,index) {
    AllCurrencies.forEach(function(value1,index1) {
      if(value.CurrencyId == value1.Id) {
       value.CurrencyCode = value1.Code;
      }
      if(value.RateCurrencyId == value1.Id) {
       value.RateCurrencyCode = value1.Code;
      }
      if(value.ProcessedType === 'NOT_PROCESSED') {
       value.ProcessedTypeShow = 'No';
      } else if(value.ProcessedType === 'PROCESSED') {
       value.ProcessedTypeShow = 'Yes';
      }
        value.CurrencyPair = value.CurrencyCode + ' / ' + value.RateCurrencyCode;
      var OrderType = value.OrderType.toLowerCase();
      value.OrderTypeShow = OrderType.charAt(0).toUpperCase() + OrderType.slice(1);
    });
    OrderList[index] = value;
  });
  callback(OrderList);
}
getRequestOrders() {
  var data = {
    AllAdmin: this.RequestOrders.AllAdmin,
    ExcludeMine: this.RequestOrders.ExcludeMine,
    OrderType: this.RequestOrders.OrderType,
    IsProcessed: this.RequestOrders.IsProcessed
  }
  return data;
}
commonOrder(data, url, callback, homeCallback) {
  data['Token'] = this.Token;
  fetch(this.Baseurl + url, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  .then((response) => response.json())
  .then((responseJson) => {
    if(responseJson.ResponseCode == 200) {
      this.formatOrderList(responseJson.Orders, callback);
    } else if (responseJson.ResponseCode == 403) {
      this.setPreLoginValues(homeCallback);
    } else {
      callback([]);
    }
  })
  .catch((error) => {
    console.error(error);
  });
}
order(values, callback, homeCallback) {
  this.RequestOrders.AllAdmin = "NO";
  this.RequestOrders.ExcludeMine = "NO";
  this.RequestOrders.OrderType = this.getOrderType();
  this.RequestOrders.IsProcessed = "";
  var data = {
    Amount: values.Amount,
    CurrencyId: values.CurrencyId,
    OrderType: values.OrderType,
    Rate: values.Rate,
    RateCurrencyId: values.RateCurrencyId,
    Token: this.Token,
    RequestOrders: this.getRequestOrders()
  };
  this.commonOrder(data, 'order/add', callback, homeCallback);
}
adminOrderList(callback, homeCallback) {
  var data = {
    RequestOrders: this.getRequestOrders()
  };
  this.commonOrder(data, 'order/list', callback, homeCallback);
}
getCurrencyName(CurrencyId) {
  var AllCurrencies = this.AllCurrencies;
  var CurrencyName = "";
  AllCurrencies.forEach(function(value,index) {
    if (CurrencyId == value.Id) {
      CurrencyName = value.Name;
    }
  });
  return CurrencyName;
}
getCurrencyCode(CurrencyId) {
  var AllCurrencies = this.AllCurrencies;
  var CurrencyCode = "";
  AllCurrencies.forEach(function(value,index) {
    if (CurrencyId == value.Id) {
      CurrencyCode = value.Code;
    }
  });
  return CurrencyCode;
}
getCurrencyObject(CurrencyId) {
  var AllCurrencies = this.AllCurrencies;
  var CurrencyObject = [];
  AllCurrencies.forEach(function(value,index) {
    if (CurrencyId == value.Id) {
      CurrencyObject = value;
    }
  });
  return CurrencyObject;
}
currencyOptions(SelectedCurrency) {
  return this.commonCurrencyOptions(this.CryptoCurrencies, SelectedCurrency);
}
rateCurrencyOptions(SelectedCurrency) {
  return this.commonCurrencyOptions(this.AllCurrencies, SelectedCurrency);
}
commonCurrencyOptions(Currencies, SelectedCurrency) {
  var CurrencyOptions = [];
  Currencies.forEach(function(value,index) {
    var Currency = [];
    if (value.Id != SelectedCurrency) {
      Currency.label = value.Code;
      Currency.value = '' + value.Id;
      CurrencyOptions[index] = Currency;
    }
  });
  return CurrencyOptions;
}
currencyList(homeCallback) {
  var data = {
    Token: this.Token
  };
  fetch(this.Baseurl + 'currency/list', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  .then((response) => response.json())
  .then((responseJson) => {
    if(responseJson.ResponseCode == 200) {
      this.AllCurrencies = responseJson.AllCurrencies;
      this.FiatCurrencies = responseJson.FiatCurrencies;
      this.CryptoCurrencies = responseJson.CryptoCurrencies;
    } else if (responseJson.ResponseCode == 403) {
      this.setPreLoginValues(homeCallback);
    } else {
    }
  })
  .catch((error) => {
    console.error();(error);
  });
}
countries(RequestCountries, callback, homeCallback) {
  var data = {
    RequestCountries: RequestCountries,
  };
  this.commonList(data, 'country/list', 'POST',
  'Countries', false, null, callback, homeCallback);
}
adminCountries(RequestCountries, callback, homeCallback) {
  var data = {
    RequestCountries: RequestCountries,
  };
  this.commonList(data, 'admincountry/list', 'POST',
  'Countries', false, null, callback, homeCallback);
}
addAdminCountry(CountryId, RequestCountries, notify, callback, homeCallback) {
  var data = {
    CountryId: CountryId,
    RequestCountries: RequestCountries,
  };
  this.commonList(data, 'admincountry/add', 'POST',
  'Countries', true, notify, callback, homeCallback);
}
deleteAdminCountry(Id, RequestCountries, notify, callback, homeCallback) {
  var data = {
    Id: Id,
    RequestCountries: RequestCountries,
  };
  this.commonList(data, 'admincountry/delete', 'DELETE',
  'Countries', true, notify, callback, homeCallback);
}
fields(RequestField, callback, homeCallback) {
  var data = {
    RequestField: RequestField,
  };
  this.commonList(data, 'field/list', 'POST',
  'Fields', false, null, callback, homeCallback);
}
uploadData(data, callback, homeCallback) {
  this.commonList(data, 'data/add', 'POST',
  'DataGroup', false, null, callback, homeCallback);
}
listData(RequestField, callback, homeCallback) {
  var data = {
    RequestField: RequestField,
  };
  this.commonList(data, 'data/list', 'POST',
  'DataGroup', false, null, callback, homeCallback);
}
uploadFile(RequestField, callback, homeCallback) {
  var data = {
    RequestField: RequestField,
  };
  this.commonList(data, 'file/upload', 'POST',
  '', false, null, callback, homeCallback);
}
listWallet(callback, homeCallback) {
  var data = {};
  this.commonList(data, 'wallet/list', 'POST',
  'WalletMasterData', false, null, callback, homeCallback);
}
addWallet(values, notify, callback, homeCallback) {
  var data = {
    CurrencyId: values.CurrencyId,
    Nickname: values.Nickname,
    primary: values.Primary,
  };
  this.commonList(data, 'wallet/add', 'POST',
  'WalletMasterData', true, notify, callback, homeCallback);
}
deleteWallet(WalletMasterId, notify, callback, homeCallback) {
  var data = {
    Id: WalletMasterId,
  };
  this.commonList(data, 'wallet/delete', 'DELETE',
  'WalletMasterData', true, notify, callback, homeCallback);
}
listPayee(callback, homeCallback) {
  var data = {};
  this.commonList(data, 'payee/list', 'POST',
  'PayeeMasterData', false, null, callback, homeCallback);
}
addPayee(values, notify, callback, homeCallback) {
  var data = {
    CurrencyId: values.CurrencyId,
    Name: values.Name,
    Email: values.Email,
    Address: values.Address,
    Nickname: values.Nickname,
  };
  this.commonList(data, 'payee/add', 'POST',
  'PayeeMasterData', true, notify, callback, homeCallback);
}
deletePayee(PayeeMasterId, notify, callback, homeCallback) {
  var data = {
    Id: PayeeMasterId,
  };
  this.commonList(data, 'payee/delete', 'DELETE',
  'PayeeMasterData', true, notify, callback, homeCallback);
}
listPayeeAll(TransferSearch, callback, homeCallback) {
  var data = {TransferSearch: TransferSearch};
  this.commonList(data, 'payee/listall', 'POST',
  'Payee', false, null, callback, homeCallback);
}
listTransfer(callback, homeCallback) {
  var data = {};
  this.commonList(data, 'transfer/list', 'POST',
  'TransferData', false, null, callback, homeCallback);
}
addTransfer(values, notify, callback, homeCallback) {
  var data = {
    FromWalletId: values.FromWalletId,
    ToWalletId: values.ToWalletId,
    ToPayeeId: values.ToPayeeId,
    ToDataId: values.ToDataId,
    Amount: values.Amount,
    TransferSearch: values.TransferSearch,
  };
  this.commonList(data, 'transfer/add', 'POST',
  'TransferData', true, notify, callback, homeCallback);
}
deleteTransfer(TransferId, notify, callback, homeCallback) {
  var data = {
    TransferId: TransferId,
  };
  this.commonList(data, 'transfer/delete', 'DELETE',
  'TransferData', true, notify, callback, homeCallback);
}
}

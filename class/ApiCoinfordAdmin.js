let instance = null;
class ApiCoinfordAdmin {
  constructor() {
    //this.Baseurl = 'http://192.168.0.203:8080/v1/';
    this.Baseurl = '//localhost:8100/v1/';
    this.Token   = '';
    this.IsLogin = false;
    this.UiName  = 'Login';
    this.AdminName = '';
    this.AdminGroup = {};
    this.AdminGroups = [];
    if(!instance){
      instance = this;
    }
    return instance;
  }
  setUiName(UiName) {
    this.UiName = UiName;
  }
  getUiName() {
    return this.UiName;
  }
  setOrderType(OrderType) {
    this.OrderType = OrderType;
  }
  getOrderType() {
    return this.OrderType;
  }
  isAdminLogin() {
    return this.IsLogin;
  }
  setPostLoginValues(responseJson, callback) {
    this.Token = responseJson.Token;
    this.IsLogin = true;
    this.UiName  = 'Dashboard';
    this.AdminName = responseJson.Name;
    this.AdminGroup = responseJson.AdminGroup;
    this.listAdminGroup(callback);
    console.log(this.Token);
    //callback();
  }
  listAdminGroup(homeCallback) {
    var data = {
      Token: this.Token
    };
    fetch(this.Baseurl + 'admin/admingroups', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.ResponseCode == 200) {
        this.AdminGroups = responseJson.AdminGroups;
        homeCallback();
      } else if (responseJson.ResponseCode == 403) {
        this.setPreLoginValues(homeCallback);
      } else {
      }
    })
    .catch((error) => {
      console.error();(error);
    });
  }
  isAdminOrSuperAdmin() {
    if(this.AdminGroup.Key == "SUPER_ADMIN" || this.AdminGroup.Key == "ADMIN") {
      return true;
    }
    return false;
  }
  setPreLoginValues(callback) {
    this.getToken();
    this.IsLogin = false;
    this.UiName  = 'Login';
    callback();
  }
  getToken() {
    fetch(this.Baseurl + 'admin/token', {
      method: 'GET',
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.Token = responseJson.Token;
    })
    .catch((error) => {
      console.error(error);
    });
  }
  commonLogin(data, url, callback) {
    data['Token'] = this.Token;
    fetch(this.Baseurl + url, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.ResponseCode == 200) {
        this.setPostLoginValues(responseJson, callback);
      } else {
        this.setPreLoginValues(callback);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  auth(callback) {
    var data = {};
    this.commonLogin(data, 'admin/auth', callback);
  }
  login(values, callback) {
    var data = {
      Adminname: values.Adminname,
      Password: values.Password,
    };
    this.commonLogin(data, 'admin/login', callback);
  }
  loginDefault(values, callback) {
    fetch(this.Baseurl + 'admin/token', {
      method: 'GET',
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.Token = responseJson.Token;
      this.login(values, callback)
    })
    .catch((error) => {
      console.error(error);
    });
  }
  logout(callback) {
    var data = {
      Token: this.Token
    };
    fetch(this.Baseurl + 'admin/logout', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.ResponseCode == 200) {
        this.setPreLoginValues(callback);
      } else {
        this.setPreLoginValues(callback);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  isUniqueAdminname(adminname, callback) {
    var data = {
      Adminname: adminname,
      Token: this.Token
    };
    fetch(this.Baseurl + 'admin/isuniqueadminname', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.ResponseCode == 200) {
        callback();
      } else {
        callback(responseJson.ResponseDescription);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  register(values, callback) {
    var data = {
      AdminGroupId: values.AdminGroupId,
      Email: values.Email,
      Name: values.Name,
      Adminname: values.Adminname,
      Password: values.Password,
      Token: this.Token
    };
    fetch(this.Baseurl + 'admin/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.ResponseCode == 200) {
        console.log(responseJson.ResponseDescription);
        //this.setPostLoginValues(responseJson, callback);
      } else if (responseJson.ResponseCode == 403) {
        this.setPreLoginValues(callback);
      } else {
        console.log(responseJson.ResponseDescription);
        /*this.getToken();
        this.IsLogin = false;
        this.UiName  = 'Register'
        callback();*/
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  capitalizeFirstLetter(string) {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  commonList(data, url, method, field, isNotify, notify, callback, homeCallback) {
    data['Token'] = this.Token;
    fetch(this.Baseurl + url, {
      method: method,
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.ResponseCode == 200) {
        callback(responseJson[field]);
      } else if (responseJson.ResponseCode == 403) {
        this.setPreLoginValues(homeCallback);
      } else {
        if(isNotify) {
          notify(responseJson.ResponseDescription);
        } else {
          callback([]);
        }
      }
    })
    .catch((error) => {
      console.error();(error);
    });
  }
  listCountries(callback, homeCallback) {
    var data = {};
    this.commonList(data, 'country/list', 'POST',
    'Countries', false, null, callback, homeCallback);
  }
  listUsers(UserSearch, callback, homeCallback) {
    var data = {UserSearch: UserSearch};
    this.commonList(data, 'user/list', 'POST',
    'UserDetail', false, null, callback, homeCallback);
  }
}
module.exports = ApiCoinfordAdmin;

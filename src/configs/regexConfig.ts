export type RegexConfigType = {
  splitName: RegExp;
  phone: RegExp;
  email: RegExp;
  phoneOrEmail: RegExp;
  url: RegExp;
  digitOnly: RegExp;
  ipAddress: RegExp;
  name: RegExp;
  withoutSpaceText: RegExp;
  isoDate: RegExp;
  panNumber: RegExp;
  aadhaarNumber: RegExp;
  password: RegExp;
  username: RegExp;
  aadharCard: RegExp;
  panCard: RegExp;
  nameWithoutSpecialCharactersAndNumber: RegExp;
  alphanumeric: RegExp;
  alphanumericMultiWord: RegExp;
  ifscValidation: RegExp;
  noSpecialChar: RegExp;
};

export const REGEX_CONFIG: RegexConfigType = {
  // name: /^[A-Za-z][\w!@#$%^&*()_+{}[\]:;"'<>,.?/|`~\s-]*$/, //for variables name type convention
  splitName: /^[a-zA-Z]+$/,
  phone: /^[6789]\d{9}$/,
  email:
    /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  phoneOrEmail:
    /^([6789]\d{9}|(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/,
  url: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\\.-]+)+[\w\-\\._~:/?#[\]@!\\$&'\\(\\)\\*\\+,;=.]+$/,
  digitOnly: /^[0-9]*$/,
  ipAddress:
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  name: /^[A-Za-z'-.]+(\s?[A-Za-z'-.])+?$/,
  withoutSpaceText: /^\S+$/,
  isoDate: /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+/,
  panNumber: /(^([a-zA-Z]{5})([0-9]{4})([a-zA-Z]{1})$)/,
  aadhaarNumber: /^\d{12}$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  username: /^[a-z0-9_-]{3,16}$/,
  aadharCard: /^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/,
  panCard: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  nameWithoutSpecialCharactersAndNumber: /^[a-zA-Z ]{0,}$/,
  alphanumeric: /^[0-9a-zA-Z]+$/,
  alphanumericMultiWord: /^[0-9a-zA-Z-.&,'/ ]{0,}$/,
  ifscValidation: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  noSpecialChar: /^[A-Za-z0-9 ]{11,17}$/,
};

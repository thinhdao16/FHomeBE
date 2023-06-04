"use strict";

require("dotenv").config();

var axios = require("axios"); //Tạo số thứ tự hóa đơn


var generatenextInvoiceNumber = function generatenextInvoiceNumber() {
  var url, token, response;
  return regeneratorRuntime.async(function generatenextInvoiceNumber$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          url = "https://api-m.sandbox.paypal.com/v2/invoicing/generate-next-invoice-number";
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(getAccessToken());

        case 4:
          token = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(axios.post(url, {}, {
            headers: {
              Authorization: "Bearer ".concat(token)
            }
          }));

        case 7:
          response = _context.sent;
          return _context.abrupt("return", response.data.invoice_number);

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](1);
          return _context.abrupt("return", "");

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 11]]);
}; // Tạo hóa đơn
// 3 params là kiểu string(chưa validate)


var createDraftInvoice = function createDraftInvoice(name, email, phone) {
  var token, nextNumber, url, today, year, month, date, formattedDate, dueDate, formattedDueDate, response;
  return regeneratorRuntime.async(function createDraftInvoice$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(getAccessToken());

        case 3:
          token = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(generatenextInvoiceNumber());

        case 6:
          nextNumber = _context2.sent;
          url = "https://api-m.sandbox.paypal.com/v2/invoicing/invoices";
          today = new Date();
          today.setDate(today.getDate() - 1); // giảm đi 1 ngày

          year = today.getFullYear();
          month = (today.getMonth() + 1).toString().padStart(2, "0");
          date = today.getDate().toString().padStart(2, "0");
          formattedDate = "".concat(year, "-").concat(month, "-").concat(date);
          dueDate = new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000);
          formattedDueDate = "".concat(dueDate.getFullYear(), "-").concat((dueDate.getMonth() + 1).toString().padStart(2, "0"), "-").concat(dueDate.getDate().toString().padStart(2, "0"));
          _context2.next = 18;
          return regeneratorRuntime.awrap(axios.post(url, {
            detail: {
              invoice_number: nextNumber,
              invoice_date: formattedDate,
              payment_term: {
                term_type: "NET_10",
                due_date: formattedDueDate
              },
              currency_code: "USD",
              reference: "<The reference data. Includes a post office (PO) number.>",
              note: "<A note to the invoice recipient. Also appears on the invoice notification email.>",
              terms_and_conditions: "<The general terms of the invoice. Can include return or cancellation policy and other terms and conditions.>",
              memo: "<A private bookkeeping note for merchant.>"
            },
            invoicer: {
              name: {
                given_name: name
              },
              phones: [{
                country_code: "084",
                national_number: phone,
                phone_type: "MOBILE"
              }]
            },
            primary_recipients: [{
              billing_info: {
                name: {
                  given_name: "Stephanie",
                  surname: "Meyers"
                },
                address: {
                  address_line_1: "1234 Main Street",
                  admin_area_2: "Anytown",
                  admin_area_1: "CA",
                  postal_code: "98765",
                  country_code: "US"
                },
                email_address: email,
                phones: [{
                  country_code: "001",
                  national_number: "4884551234",
                  phone_type: "HOME"
                }],
                additional_info_value: "add-info"
              }
            }],
            items: [{
              name: "Thanh toan post bai",
              description: "post bai goi super vip",
              quantity: "1",
              unit_amount: {
                currency_code: "USD",
                value: "50.00"
              },
              unit_of_measure: "QUANTITY"
            }],
            configuration: {
              partial_payment: {
                allow_partial_payment: true,
                minimum_amount_due: {
                  currency_code: "USD",
                  value: "20.00"
                }
              },
              allow_tip: true,
              tax_calculated_after_discount: true,
              tax_inclusive: false
            },
            amount: {
              breakdown: {
                custom: {
                  label: "Packing Charges",
                  amount: {
                    currency_code: "USD",
                    value: "10.00"
                  }
                },
                discount: {
                  invoice_discount: {
                    percent: "0"
                  }
                }
              }
            }
          }, {
            headers: {
              Authorization: "Bearer ".concat(token)
            }
          }));

        case 18:
          response = _context2.sent;
          return _context2.abrupt("return", response.data);

        case 22:
          _context2.prev = 22;
          _context2.t0 = _context2["catch"](0);

        case 24:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 22]]);
}; // lấy accessToken account business


function getAccessToken() {
  var username, password, url, response;
  return regeneratorRuntime.async(function getAccessToken$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          username = process.env.CLIENT_ID;
          password = process.env.SECRET_ID;
          url = "https://api-m.sandbox.paypal.com/v1/oauth2/token";
          _context3.prev = 3;
          _context3.next = 6;
          return regeneratorRuntime.awrap(axios.post(url, {
            grant_type: "client_credentials"
          }, {
            headers: {
              Accept: "application/json",
              "Accept-Language": "en_US",
              "content-type": "application/x-www-form-urlencoded",
              grant_type: "client_credentials"
            },
            auth: {
              username: username,
              password: password
            }
          }));

        case 6:
          response = _context3.sent;
          return _context3.abrupt("return", response.data.access_token);

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](3);
          console.log(_context3.t0.message);
          return _context3.abrupt("return", null);

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[3, 10]]);
} // chuyển sang trạng thái chưa thanh toán
// truyền hóa đơn id đang trong status draft
// id la kieu string (nho validate)


function changeInvoiceStatusToUNPAID(hoadonId) {
  var link, url, body, token, response;
  return regeneratorRuntime.async(function changeInvoiceStatusToUNPAID$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          link = "";
          url = "https://api-m.sandbox.paypal.com/v2/invoicing/invoices/".concat(hoadonId, "/send");
          body = {
            send_to_recipient: false,
            send_to_invoicer: false
          };
          _context4.next = 5;
          return regeneratorRuntime.awrap(getAccessToken());

        case 5:
          token = _context4.sent;
          _context4.prev = 6;
          _context4.next = 9;
          return regeneratorRuntime.awrap(axios.post(url, body, {
            headers: {
              Authorization: "Bearer ".concat(token)
            }
          }));

        case 9:
          response = _context4.sent;
          link = response.data.href;
          return _context4.abrupt("return", link);

        case 14:
          _context4.prev = 14;
          _context4.t0 = _context4["catch"](6);
          console.log(_context4.t0.message);
          return _context4.abrupt("return", link);

        case 18:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[6, 14]]);
} // delete hóa đơn
// chi delete hoa don trong status  draft, scheduled, or canceled status
// nho check truoc


function deleteInvoice(invoiceId) {
  var url, token;
  return regeneratorRuntime.async(function deleteInvoice$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          url = "https://api-m.sandbox.paypal.com/v2/invoicing/invoices/".concat(invoiceId);
          _context5.next = 3;
          return regeneratorRuntime.awrap(getAccessToken());

        case 3:
          token = _context5.sent;
          _context5.prev = 4;
          _context5.next = 7;
          return regeneratorRuntime.awrap(axios["delete"](url, {
            headers: {
              Authorization: "Bearer ".concat(token)
            }
          }));

        case 7:
          _context5.next = 12;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](4);
          console.log(_context5.t0);

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[4, 9]]);
} // lay danh sach hoa don dang


function getListInvoices() {
  var url, token, result, response;
  return regeneratorRuntime.async(function getListInvoices$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          url = "https://api-m.sandbox.paypal.com/v2/invoicing/invoices?&total_required=true&fields=amount";
          _context6.next = 3;
          return regeneratorRuntime.awrap(getAccessToken());

        case 3:
          token = _context6.sent;
          result = "";
          _context6.prev = 5;
          _context6.next = 8;
          return regeneratorRuntime.awrap(axios.get(url, {
            headers: {
              Authorization: "Bearer ".concat(token)
            }
          }));

        case 8:
          response = _context6.sent;
          result = response.data;
          return _context6.abrupt("return", result);

        case 13:
          _context6.prev = 13;
          _context6.t0 = _context6["catch"](5);
          console.log(_context6.t0);
          return _context6.abrupt("return", result);

        case 17:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[5, 13]]);
}

function getInvoiceDetail(hoadonId) {
  var url, token, result, response;
  return regeneratorRuntime.async(function getInvoiceDetail$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          url = "https://api-m.sandbox.paypal.com/v2/invoicing/invoices/".concat(hoadonId);
          _context7.next = 3;
          return regeneratorRuntime.awrap(getAccessToken());

        case 3:
          token = _context7.sent;
          result = "";
          _context7.prev = 5;
          _context7.next = 8;
          return regeneratorRuntime.awrap(axios.get(url, {
            headers: {
              Authorization: "Bearer ".concat(token)
            }
          }));

        case 8:
          response = _context7.sent;
          result = response.data;
          return _context7.abrupt("return", result);

        case 13:
          _context7.prev = 13;
          _context7.t0 = _context7["catch"](5);
          console.log(_context7.t0.message);
          return _context7.abrupt("return", result);

        case 17:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[5, 13]]);
}

module.exports = {
  generatenextInvoiceNumber: generatenextInvoiceNumber,
  createDraftInvoice: createDraftInvoice,
  getAccessToken: getAccessToken,
  changeInvoiceStatusToUNPAID: changeInvoiceStatusToUNPAID,
  deleteInvoice: deleteInvoice,
  getListInvoices: getListInvoices,
  getInvoiceDetail: getInvoiceDetail
};
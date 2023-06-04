require("dotenv").config();
const axios = require("axios");
const Postings = require("../models/posting");

//Tạo số thứ tự hóa đơn
const generatenextInvoiceNumber = async () => {
  const url =
    "https://api-m.sandbox.paypal.com/v2/invoicing/generate-next-invoice-number";
  try {
    const token = await getAccessToken();
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.invoice_number;
  } catch (error) {
    return "";
  }
};

// Tạo hóa đơn
// 3 params là kiểu string(chưa validate)
const createDraftInvoice = async (name, email, phone) => {
  try {
    const token = await getAccessToken();
    const nextNumber = await generatenextInvoiceNumber();
    const url = "https://api-m.sandbox.paypal.com/v2/invoicing/invoices";

    const today = new Date();
    today.setDate(today.getDate() - 1); // giảm đi 1 ngày
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const date = today.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${date}`;

    const dueDate = new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000);
    const formattedDueDate = `${dueDate.getFullYear()}-${(
      dueDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${dueDate.getDate().toString().padStart(2, "0")}`;

    const response = await axios.post(
      url,
      {
        detail: {
          invoice_number: nextNumber,
          invoice_date: formattedDate,
          payment_term: {
            term_type: "NET_10",
            due_date: formattedDueDate,
          },
          currency_code: "USD",
          reference:
            "<The reference data. Includes a post office (PO) number.>",
          note: "<A note to the invoice recipient. Also appears on the invoice notification email.>",
          terms_and_conditions:
            "<The general terms of the invoice. Can include return or cancellation policy and other terms and conditions.>",
          memo: "<A private bookkeeping note for merchant.>",
        },
        invoicer: {
          name: {
            given_name: name,
          },
          phones: [
            {
              country_code: "084",
              national_number: phone,
              phone_type: "MOBILE",
            },
          ],
        },
        primary_recipients: [
          {
            billing_info: {
              name: {
                given_name: "",
                surname: name,
              },
              // address: {
              //   address_line_1: "1234 Main Street",
              //   admin_area_2: "Anytown",
              //   admin_area_1: "CA",
              //   postal_code: "98765",
              //   country_code: "US",
              // },
              email_address: email,
              phones: [
                {
                  country_code: "084",
                  national_number: phone,
                  phone_type: "HOME",
                },
              ],
              additional_info_value: "add-info",
            },
          },
        ],
        items: [
          {
            name: "Thanh toan",
            description: "Thanh toan bai dang",
            quantity: "1",
            unit_amount: {
              currency_code: "USD",
              value: "1.00",
            },
            unit_of_measure: "QUANTITY",
          },
        ],
        // configuration: {
        //   partial_payment: {
        //     allow_partial_payment: false,
        //     minimum_amount_due: {
        //       currency_code: "USD",
        //       value: "20.00",
        //     },
        //   },
        //   allow_tip: false,
        //   tax_calculated_after_discount: true,
        //   tax_inclusive: false,
        // },
        // amount: {
        //   breakdown: {
        //     custom: {
        //       label: "Packing Charges",
        //       amount: {
        //         currency_code: "USD",
        //         value: "10.00",
        //       },
        //     },
        //     discount: {
        //       invoice_discount: {
        //         percent: "0",
        //       },
        //     },
        //   },
        // },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
  }
};

// lấy accessToken account business
async function getAccessToken() {
  const username = process.env.CLIENT_ID;
  const password = process.env.SECRET_ID;
  const url = "https://api-m.sandbox.paypal.com/v1/oauth2/token";

  try {
    const response = await axios.post(
      url,
      {
        grant_type: "client_credentials",
      },
      {
        headers: {
          Accept: "application/json",
          "Accept-Language": "en_US",
          "content-type": "application/x-www-form-urlencoded",
          grant_type: "client_credentials",
        },
        auth: {
          username: username,
          password: password,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    return null;
  }
}
// chuyển sang trạng thái chưa thanh toán
// truyền hóa đơn id đang trong status draft
// id la kieu string (nho validate)
async function changeInvoiceStatusToUNPAID(hoadonId) {
  let link = "";
  const url = `https://api-m.sandbox.paypal.com/v2/invoicing/invoices/${hoadonId}/send`;
  const body = {
    send_to_recipient: false,
    send_to_invoicer: false,
  };
  const token = await getAccessToken();
  try {
    const response = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    link = response.data.href;
    return link;
  } catch (error) {
    return link;
  }
}

// delete hóa đơn
// chi delete hoa don trong status  draft, scheduled, or canceled status
// nho check truoc
async function deleteInvoice(invoiceId) {
  const url = `https://api-m.sandbox.paypal.com/v2/invoicing/invoices/${invoiceId}`;
  const token = await getAccessToken();
  try {
    await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
  }
}

// lay danh sach hoa don dang
async function getInvoiceDetail(hoadonId) {
  const url = `https://api-m.sandbox.paypal.com/v2/invoicing/invoices/${hoadonId}`;
  const token = await getAccessToken();
  let result = "";
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    result = response.data;
    return result;
  } catch (error) {
    return result;
  }
}
// lay danh sach hoa don dang
async function checkPublishedPost() {
  const url = `https://api-m.sandbox.paypal.com/v2/invoicing/invoices?&total_required=true&fields=amount`;
  const token = await getAccessToken();
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const listInvoice = response.data.items;

    for (let i = 0; i < listInvoice.length; i++) {
      if (listInvoice[i].status === "PAID") {
        posts = await Postings.findOne({ invoiceId: listInvoice[i].id });
        if (posts !== null) {
          const updatePost = posts;
          updatePost.status = "published";
          await updatePost.save();        }
      }
    }
    return response.data;
  } catch (error) {
  }
}
async function getInvoiceDetail(hoadonId) {
  const url = `https://api-m.sandbox.paypal.com/v2/invoicing/invoices/${hoadonId}`;
  const token = await getAccessToken();
  let result = "";
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    result = response.data;
    return result;
  } catch (error) {
    return result;
  }
}

module.exports = {
  generatenextInvoiceNumber,
  createDraftInvoice,
  getAccessToken,
  changeInvoiceStatusToUNPAID,
  deleteInvoice,
  checkPublishedPost,
  getInvoiceDetail,
  checkPublishedPost,
};

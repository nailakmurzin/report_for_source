// const callMethod = (methodName, options, callback)=>window.BX24.callMethod(methodName, options, callback)
export default class Bitrix {
  constructor(core = null) {
    this.core = core || window.BX24;
    window.BX24.init(() => console.log("BITRIX INIT"));
  }

  callMethod(methodName, options = {}) {
    return new Promise((resolve, reject) => {
      let data = [];
      if (this.core) {
        window.BX24?.callMethod(methodName, options, (result) => {
          if (result.error()) {
            console.error(result.error());
            reject(result);
          } else {
            data = [...result.data()];
            if (result.more()) {
              result.next();
            } else {
              resolve(data);
            }
          }
        });
      } else {
        reject();
      }
    });
  }

  async getSources() {
    const sources = await this.callMethod("crm.status.list", {
      order: { SORT: "ASC" },
      filter: { ENTITY_ID: "SOURCE" },
    });
    console.log("sources", sources);
  }

  async getDeals() {
    const deals = await this.callMethod("crm.deal.list", {
      order: { BEGINDATE: "ASC" },
      filter: { ">BEGINDATE": "2021-10-01T03:00:00+03:00" },
      select: ["SOURCE_ID", "OPPORTUNITY", "TITLE", "BEGINDATE"],
    });
    console.log("deals", deals);
  }
}

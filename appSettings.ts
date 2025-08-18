interface AppSettings {
    stockK: {
        baseUrl: string;
        baseApiUrl: string;
    }
    logging: {
        path: string
    }
    databases: {
        redis: {
            connectionString: string
        }
        stockKInternal: {
            connectionString: string
        }
        stockKExternal: {
            connectionString: string
        }
    }
    users: {
        hnu: {
            userName: string;
            password: string;
            descripton: string;
            role: string
        }
        sys: {
            userName: string;
            password: string;
            descripton: string;
            role: string
        }
        dlt: {
            userName: string;
            password: string;
            descripton: string;
            role: string
        }
        portspeduser: {
            userName: string;
            password: string;
            descripton: string;
            role: string
        }
        annexuser: {
            userName: string;
            password: string;
            descripton: string;
            role: string
        }
    }
    biztalkAPI: {
        baseUrl: string
        userName: string
        password: string
    }
    ai: {
        deepSeek: {
            apiKey: string
            baseUrl: string
            model: string
        }
        openAI: {
            apiKey: string
            model: string
            baseUrl: string
        }
    }
}
    
export const appSettings : AppSettings = {
    stockK: {
        baseUrl: "https://stockkqa.sucafina.corp/",
        baseApiUrl: "https://stockkqa.sucafina.corp:44317/api"
    },
    logging: {
        path: "./logs"
    },
    databases: {
        redis: {
            connectionString: "localhost:6379"
        },
        stockKInternal: {
            connectionString: "Server=.;Database=10.10.1.107;User Id=it-dev;Password=Dev@123;TrustServerCertificate=True"
        },
        stockKExternal: {
            connectionString: "Server=SUCUAT;Database=StockKDb;User Id=stockkapp;Password=k$6Hd2F!8nLz;TrustServerCertificate=True"
        }
    },
    users: {
        hnu: {
            userName: "hnu",
            password: "Dev@1234",
            descripton: "",
            role: "Goods owner"
        },
        sys: {
            userName: "sys",
            password: "123",
            descripton: "",
            role: "Warehouse keeper"
        },
        dlt: {
            userName: "dlt",
            password: "Dev@1234",
            descripton: "",
            role: "Goods owner"
        },
        portspeduser: {
            userName: "portspeduser",
            password: "123",
            descripton: "",
            role: "Warehouse Keeper"
        },
        annexuser: {
            userName: "annexuser",
            password: "123",
            descripton: "user for ANXUS",
            role: "Warehouse Keeper"
        }
    },
    biztalkAPI: {
        baseUrl: "https://uat.stockk.org/v1/inbound_web/RestService.svc",
        userName: "biztalktestuser",
        password: "M)C5$f5LC&V$HYA4"
    },
    ai: {
        deepSeek: {
            apiKey: "sk-f75469c79b2a49a789c39aa23932d21a",
            baseUrl: "https://api.deepseek.com",
            model: "deepseek-chat"
        },
        openAI: {
            apiKey: "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",
            model: "o4-mini",
            baseUrl: ""
        }
    }
};

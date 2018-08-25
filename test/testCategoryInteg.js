import path from 'path'
import api from "../src"
import ENV from "../src/env"
import {init, withTest} from "test-api-express-mongo/dist/api"

describe('Integ Categories', function () {
    
    beforeEach(init(api, ENV, {CAT: ENV.DB_COLLECTION}))
    
    let importCategoryFile = {
        req: {
            url: "/api/categories/bulk/ademe",
            method: "POST",
            file: {
                field: "xlsx.ademe.trunk",
                path: path.resolve("files/CUT_BIG_BI_1.09__02_Procedes_Details.xlsx")
            }
        },
        res: {
            bodypath: [
                {path: "$.ok", value: 1},
                {path: "$.writeErrors", value: [[]]},
                {path: "$.insertedIds.length", value: 25},
            ]
        }
    }
    
    it('POST ademe categories file', withTest(importCategoryFile))
    
    it('GET categories root', withTest(
        {
            req: {
                url: "/api/categories"
            },
            res: {
                bodypath: [
                    {path: "$.length", value: 3},
                    {path: "$..pid", value: [null, null, null]},
                    {path: "$..name", value: ['Production agro-alimentaire', 'Textile', 'Traitement de fin de vie']},
                ]
            }
        }
    ))
    
    it('GET categories subitems', withTest(
        {
            req: {
                url: "/api/categories?pid=5b814eb404418d4d9f2943ae"
            },
            res: {
                bodypath: [
                    {path: "$.length", value: 2},
                    {path: "$.._id", value: ['5b814eb404418d4d9f2943b1', '5b814eb404418d4d9f2943af']},
                    {path: "$..pid", value: ['5b814eb404418d4d9f2943ae', '5b814eb404418d4d9f2943ae']},
                    {path: "$..name", value: ['Ennoblissement', 'Mise en forme']},
                ]
            }
        }
    ))
})
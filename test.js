"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var createManyGrants;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.grant.createMany({
                        data: [
                            { GrantName: "Mock Grant One",
                                FundingAreas: ["Education"],
                                KidsUProgram: ["Afterschool Tutoring"],
                                FundingRestrictions: "None",
                                ContactType: "Email Grant",
                                GrantOpeningDates: [new Date("2023-01-01"), new Date("2023-02-01"), new Date("2023-03-01")],
                                EndOfGrantReportDueDate: new Date("2025-01-31"),
                                GrantDueDate: new Date("2024-09-15"),
                                AskDate: new Date("2023-06-15"),
                                AwardDate: null,
                                ReportingDates: [new Date("2024-01-15"), new Date("2024-07-15")],
                                TypeOfReporting: "Quarterly",
                                DateToReapplyForGrant: new Date("2025-06-01"),
                                WaitingPeriodToReapply: 2,
                                AskAmount: 50000.00,
                                AwardStatus: "Declined",
                                AmountAwarded: 0.00 },
                            { GrantName: "Mock Grant Two",
                                FundingAreas: ["Education"],
                                KidsUProgram: ["Youth Empowerment"],
                                FundingRestrictions: "None",
                                ContactType: "Email Grant",
                                GrantOpeningDates: [new Date("2023-04-01"), new Date("2023-05-01"), new Date("2023-06-01")],
                                EndOfGrantReportDueDate: new Date("2025-03-31"),
                                GrantDueDate: new Date("2026-04-06"),
                                AskDate: new Date("2023-07-15"),
                                AwardDate: null,
                                ReportingDates: [new Date("2024-04-15"), new Date("2024-10-15")],
                                TypeOfReporting: "Biannually",
                                DateToReapplyForGrant: new Date("2025-07-01"),
                                WaitingPeriodToReapply: 3,
                                AskAmount: 6500.00,
                                AwardStatus: "Pending",
                                AmountAwarded: 0.00, },
                            { GrantName: "Mock Grant Three",
                                FundingAreas: ["Education"],
                                KidsUProgram: ["After School Tutoring"],
                                FundingRestrictions: "None",
                                ContactType: "John Smith",
                                GrantOpeningDates: [new Date("2000-08-12"), new Date("2001-05-01"), new Date("2023-06-01")],
                                EndOfGrantReportDueDate: new Date("2007-09-23"),
                                GrantDueDate: new Date("2008-02-17"),
                                AskDate: new Date("2001-08-15"),
                                AwardDate: null,
                                ReportingDates: [new Date("2004-04-01"), new Date("2005-10-15")],
                                TypeOfReporting: "Yearly",
                                DateToReapplyForGrant: new Date("2009-12-01"),
                                WaitingPeriodToReapply: 2,
                                AskAmount: 16500.00,
                                AwardStatus: "Accepted",
                                AmountAwarded: 1000.00, },
                            { GrantName: "Mock Grant Four",
                                FundingAreas: ["Education"],
                                KidsUProgram: ["Youth Empowerment"],
                                FundingRestrictions: "None",
                                ContactType: "Email Grant",
                                GrantOpeningDates: [new Date("2030-06-24"), new Date("2035-07-21"), new Date("2040-08-16")],
                                EndOfGrantReportDueDate: new Date("2040-12-20"),
                                GrantDueDate: new Date("2040-12-21"),
                                AskDate: new Date("2031-07-16"),
                                AwardDate: null,
                                ReportingDates: [new Date("2035-04-15"), new Date("2037-11-15")],
                                TypeOfReporting: "Biannually",
                                DateToReapplyForGrant: new Date("2045-07-25"),
                                WaitingPeriodToReapply: 3,
                                AskAmount: 30000.00,
                                AwardStatus: "Accepted",
                                AmountAwarded: 15000.00, },
                            { GrantName: "Mock Grant Five",
                                FundingAreas: ["Education"],
                                KidsUProgram: ["Marketing Video"],
                                FundingRestrictions: "None",
                                ContactType: "Email Grant",
                                GrantOpeningDates: [new Date("2026-05-01"), new Date("2027-06-01"), new Date("2028-07-01")],
                                EndOfGrantReportDueDate: new Date("2028-04-31"),
                                GrantDueDate: new Date("2029-05-05"),
                                AskDate: new Date("2026-08-25"),
                                AwardDate: null,
                                ReportingDates: [new Date("2027-04-25"), new Date("2027-10-25")],
                                TypeOfReporting: "Biannually",
                                DateToReapplyForGrant: new Date("2028-07-30"),
                                WaitingPeriodToReapply: 1,
                                AskAmount: 20000.00,
                                AwardStatus: "Pending",
                                AmountAwarded: 0.00, },
                            { GrantName: "Mock Grant Six",
                                FundingAreas: ["Education"],
                                KidsUProgram: ["New Site"],
                                FundingRestrictions: "None",
                                ContactType: "Email Grant",
                                GrantOpeningDates: [new Date("2010-10-10"), new Date("2011-11-11"), new Date("2012-12-12")],
                                EndOfGrantReportDueDate: new Date("2013-01-13"),
                                GrantDueDate: new Date("2014-02-14"),
                                AskDate: new Date("2010-09-09"),
                                AwardDate: null,
                                ReportingDates: [new Date("2011-05-05"), new Date("2012-06-06")],
                                TypeOfReporting: "Quarterly",
                                DateToReapplyForGrant: new Date("2014-03-14"),
                                WaitingPeriodToReapply: 5,
                                AskAmount: 18000.00,
                                AwardStatus: "Declined",
                                AmountAwarded: 0.00, }
                        ]
                    })];
                case 1:
                    createManyGrants = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) { throw e; })
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, prisma.$disconnect()];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); });

import AboutService from './aboutService'
import AccountService from './accountService'
import CreditsService from './creditsService'
import OverviewService from './overviewService'
import TableService from './tableService'
import TermsService from './termsService'

const services = {
    about: AboutService,
    account: AccountService,
    credits: CreditsService,
    overview: OverviewService,
    table: TableService,
    terms: TermsService
}

export const ServiceFactory = {
    get: name => services[name]()
}
// export default {
//     get: name => services[name]
// }
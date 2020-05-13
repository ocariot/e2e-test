let defaultFamily = require('../../../../fixtures/account/models/users/family/family.json')
let defaultChild01 = require('../../../../fixtures/account/models/users/children/child01.json')
let incompleteQ23 = require('../../../../fixtures/quest/models/q23ipaq/incompleteQ23.json')
const cardSelector = require('../../../../fixtures/ui/cards.selector')
const questDescription = require('../../../../fixtures/ui/quest.description')
const questResource = require('../../../../fixtures/quest/utils/quest.resources')

describe('Q23IPAQ', () => {
    let state = {}
    let accessTokenDefaultFamily = null

    before(() => {
        cy.task('accountDBConnect')
        cy.task('questDBConnect')
        cy.task('cleanAccountDB')
        cy.task('cleanQuestDB')

        cy.auth('admin', 'admin123').then(accessToken => state.accessTokenAdmin = accessToken)
        cy.createInstitution(state).then(institution => {
            defaultFamily.institution_id = institution.id
            defaultChild01.institution_id = institution.id
        })
        cy.createChild(defaultChild01, state).then(child => {
            defaultChild01.id = child.id
            defaultFamily.children.push(child.id)
        })
        cy.createFamily(defaultFamily, state).then(family => defaultFamily.id = family.id)
        cy.auth(defaultFamily.username, defaultFamily.password)
            .then(accessToken => accessTokenDefaultFamily = accessToken)
    })

    after(() => {
        cy.task('cleanAccountDB')
        cy.task('cleanQuestDB')
        cy.task('accountDBDispose')
        cy.task('questDBDispose')
    })

    it('When only 50% of the Q23IPAQ was filled', () => {
        incompleteQ23.child_id = defaultChild01.username
        cy.createQuest(questResource.Q23IPAQ, incompleteQ23, accessTokenDefaultFamily)

        cy.visit(Cypress.env('dashboard_uri'))
        cy.loginUI(defaultFamily)
        cy.familyFirstLogin(defaultFamily)
        cy.checkNumberOfIncompleteQuestOnTheCard(cardSelector.ACTIVITY, 4)
        cy.selectCard(cardSelector.ACTIVITY)
        cy.checkQ23Status('Incompleto 50%')
        cy.selectQuest(questDescription.PARENTS_ACTIVITY)
        cy.checkIncompleteParentsActivityQuest(incompleteQ23)
    })
})
let defaultEducator = require('../../../fixtures/account/models/users/educators/educator.json')
let defaultChild01 = require('../../../fixtures/account/models/users/children/child01.json')
let defaultChildrenGroup = require('../../../fixtures/account/models/children-groups/group01.json')
let completeQ501 = require('../../../fixtures/quest/models/q501/q501.json')
const cardSelector = require('../../../fixtures/ui/cards.selector')
const questDescription = require('../../../fixtures/ui/quest.description')
const user = require('../../../fixtures/account/utils/account.resources')
const quest = require('../../../fixtures/quest/utils/quest.resources')

describe('Missions', () => {
    let state = {}
    let accessTokenDefaultEducator = null

    before(() => {
        cy.task('accountDBConnect')
        cy.task('missionsDBConnect')
        cy.task('cleanAccountDB')
        cy.task('missionsDBRestore')

        cy.auth('admin', 'admin123').then(accessToken => state.accessTokenAdmin = accessToken)
        cy.createInstitution(state).then(institution => {
            defaultEducator.institution_id = institution.id
            defaultChild01.institution_id = institution.id
        })
        cy.createUser(user.EDUCATOR, defaultEducator, state)
            .then(educador => defaultEducator.id = educador.id)

        cy.createUser(user.CHILD, defaultChild01, state).then(child => {
            defaultChild01.id = child.id
            defaultChildrenGroup.children.push(child.id)
        })
        cy.registerGroupFromEducador(defaultEducator, defaultChildrenGroup)
        cy.auth(defaultEducator.username, defaultEducator.password)
            .then(accessToken => accessTokenDefaultEducator = accessToken)
    })

    after(() => {
        cy.task('cleanAccountDB')
        cy.task('missionsDBRestore')
        cy.task('accountDBDispose')
    })

    it('When Missions was completely filled', () => {
        completeQ501.child_id = defaultChild01.username
        let mission = getMission(defaultEducator)

        cy.createEducatorMissions(mission, accessTokenDefaultEducator)

        // cy.visit(Cypress.env('dashboard_uri'))
        // cy.loginUI(defaultEducator)
        // cy.checkChild(defaultChild01)
        // cy.selectChild(defaultChild01)
        // cy.selectCard(cardSelector.MISSIONS)
    })
})

function getMission(educator) {
    const mission = {
        creatorId: educator.id,
        type: "PhysicalActivity",
        goal: [
            {
                "locale": "en",
                "text": "D3"
            }
        ],
        description: [
            {
                "locale": "en",
                "text": "description"
            }
        ],
        durationType: "Day",
        durationNumber: "4",
        childRecommendation: [
            {
                "locale": "en",
                "text": "child recomendation"
            }
        ],
        parentRecommendation: [
            {
                "locale": "en",
                "text": "parent recomendation"
            }
        ]
    }

    return mission
}
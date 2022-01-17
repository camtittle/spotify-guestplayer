describe('createParty', () => {
    it('launches spotify sign-in flow', () => {
        cy.visit('/');

        // Navigate to create party flow
        cy.contains('Host a party').click();
        cy.url().should('contain', '/party/create/intro');

        // Navigate to get started 
        cy.contains('Get started').click();
        cy.url().should('contain', '/party/create').should('not.contain', 'intro');

        // Init Spotify auth flow
        cy.contains('Connect to Spotify').click();
        cy.url().should('contain', 'accounts.spotify.com');

        // Mock the token endpoint
        cy.intercept(
            {
                method: 'POST',
                path: '/api/spotify/token',
            },
            {
                fixture: 'spotifyCredentials.json'
            }
        ).as('spotifyCredentials');

        // Mock the Spotify /me endpoint
        cy.intercept(
            {
                method: 'GET',
                url: 'https://api.spotify.com/v1/me',
            },
            {
                fixture: 'spotifyUserDetails.json'
            }
        ).as('spotifyUserDetails');

        // Extract state value from query params
        cy.location('search').then(queryString => {
            const params = new URLSearchParams(decodeURIComponent(queryString));
            const oauthState = params.get('state');

            cy.visit(`party/create/callback?code=testCode&state=${oauthState}`);

            cy.fixture('spotifyUserDetails.json').then(userProfile => {
                cy.contains(userProfile.display_name);
                cy.get('[class*=profileDetails]').find('img').should('have.attr', 'src').should('include', userProfile.images[0].url);
            });
        });
    });

    specify('party creation flow', () => {

        cy.visit('/');



    });
})
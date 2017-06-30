declare var $: Function;

/**
 * Sends an ajax request to a directory service.
 *
 * @param {string} serviceUrl - The service to query.
 * @param {string} jwt - The jwt token to pass to the search service.
 * @param {string} text - Text to search.
 * @returns {Promise} - The promise created by the request.
 */
export function searchPeople(serviceUrl, jwt, text) {
    const queryTypes = '["conferenceRooms","user","room"]';

    return new Promise((resolve, reject) => {
        $.getJSON(`${serviceUrl}?query=${text}
            &queryTypes=${queryTypes}&jwt=${jwt}`,
        response => resolve(response)
        ).fail((jqxhr, textStatus, error) =>
            reject(error)
        );
    });
}

/**
 * Sends a post request to an invite service.
 *
 * @param {string} inviteServiceUrl - The invite service that generates the
 * invitation.
 * @param {string} inviteUrl - The url to the conference.
 * @param {string} jwt - The jwt token to pass to the search service.
 * @param {Immutable.List} inviteItems - The list of items to invite.
 * @returns {Promise} - The promise created by the request.
 */
export function invitePeople(inviteServiceUrl, inviteUrl, jwt, inviteItems) { // eslint-disable-line max-params, max-len
    return new Promise((resolve, reject) => {
        $.post(`${inviteServiceUrl}?token=${jwt}`,
            JSON.stringify({
                'invited': inviteItems,
                'url': inviteUrl }),
            response => resolve(response),
            'json')
            .fail((jqxhr, textStatus, error) =>
                reject(error)
            );
    });
}

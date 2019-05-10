const METHOD = {
    POST: 'POST',
    GET: 'GET',
};
const CREATE_USER = '/create-user';
const INDEX = '/';
const USERS = '/users';

const users = [];

function htmlTemplate(title, body) {
    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
        <title>${title}</title>
      </head>
      <body>
        ${body}
      </body>
    </html>
    `;
}

function requestsHandler(req, res) {
    const { url, method } = req;
    let title;
    let body;

    switch (method) {
        case METHOD.POST:
            switch (url) {
                case CREATE_USER:
                    const body = [];

                    req.on('data', chunk => {
                        body.push(chunk);
                    });

                    req.on('end', () => {
                        const [name, user] = Buffer.concat(body)
                            .toString()
                            .split('=');

                        users.push(user);
                        console.log(users);

                        res.statusCode = 302;
                        res.setHeader('Location', '/users');
                        res.end();
                    });

                default:
                    break;
            }
            break;
        case METHOD.GET:
            switch (url) {
                case INDEX:
                    title = 'Create user';
                    body = `
                      <h1>Create user</h1>
                      <form action="${CREATE_USER}" method="${METHOD.POST}">
                        <input type="text" name="user" />
                        <button type="submit">Send</button>
                      </form>   
                    `;
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/html');
                    res.write(htmlTemplate(title, body));
                    return res.end();

                case USERS:
                    title = 'Users';
                    body = `
                    <h1>Users:</h1>
                    <ul>
                      ${users.map(user => `<li>${user}</li>`).join('')}
                    </ul>
                  `;
                    res.setHeader('Content-Type', 'text/html');
                    res.write(htmlTemplate(title, body));
                    return res.end();

                default:
                    res.statusCode = 200;
                    res.write('Hello world');
                    return res.end();
            }
        default:
            break;
    }
}

module.exports = requestsHandler;

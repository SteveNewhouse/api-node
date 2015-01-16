## api-node
Interacting with the Work Market API using node.js

This simple service polls the assignments/list_updated endpoint for modified assignments.  If any are found, it fetches and prints the full details of that assignment.

### Instructions

Install dependencies with npm.

```
cd path/to/api-node
npm install
```

Update server.js with your api.dev.workmarket.com (sandbox) API token & secret.  Then, start the service:

```
node server.js
```

Enjoy!

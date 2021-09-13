const NAV_LIST = [
    {
        name: "Home",
        route: "/"
    },
    {
        name: "Accounts",
        route: "/accounts"
    },
    {
        name: "Settings",
        sub: [
            {
                name: "My Account",
                route: ({ accountId }) => `/accounts/${accountId}`
            },
            {
                name: "Logout"
            }
        ]
    }
];

export default NAV_LIST;

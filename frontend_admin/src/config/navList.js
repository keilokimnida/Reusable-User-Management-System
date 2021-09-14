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
                route: ({ account_id }) => `/accounts/${account_id}`
            },
            {
                name: "Logout",
                handleClick: () => alert("log out")
            }
        ]
    }
];

export default NAV_LIST;

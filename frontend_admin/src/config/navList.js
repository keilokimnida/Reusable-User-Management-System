const NAV_LIST = [
    {
        name: "Home",
        route: "/"
    },
    {
        name: "Users",
        route: "/users"
    },
    {
        name: "Settings",
        sub: [
            {
                name: "My Account",
                route: "/me"
            },
            {
                name: "Logout",
                handleClick: () => alert("log out")
            }
        ]
    }
];

export default NAV_LIST;

import { useLogout } from '../hooks/useLogout';

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
        name: "Plans",
        route: "/plans"
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
                type: "logout"
            }
        ]
    }
];

export default NAV_LIST;

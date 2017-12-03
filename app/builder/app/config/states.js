// ███████╗████████╗ █████╗ ████████╗███████╗███████╗
// ██╔════╝╚══██╔══╝██╔══██╗╚══██╔══╝██╔════╝██╔════╝
// ███████╗   ██║   ███████║   ██║   █████╗  ███████╗
// ╚════██║   ██║   ██╔══██║   ██║   ██╔══╝  ╚════██║
// ███████║   ██║   ██║  ██║   ██║   ███████╗███████║
// ╚══════╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚══════╝
config.app.provide('states', [{
    id: 'root',
    no_controller: true,
    abstract: true,
    url: '',
    states: [
        // ALLOW READ PARAMETER
        {
            id: 'root.home',
            url: '/',
            // policy: ['authentified']
        },
        // NO POLICY
        {
            id: 'root.auth',
            url: '/auth'
        }
    ]
}]);
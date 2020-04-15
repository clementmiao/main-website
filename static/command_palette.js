Vue.component('action-item', {
    props: ['action', 'message'],
    template: '<li>{{ action.text }} {{ message }}</li>'
});

var app = new Vue({ 
    el: '#app',
    data: {
        seen: false,
        message: 'input a command...',
        actionList: [
            { id: 0, text: 'Delete deal' },
            { id: 1, text: 'Close deal' },
            { id: 2, text: 'Re-open deal' }
        ]
    },
    methods: {
        showCommandPalette: function () {
            this.seen = !this.seen
        },
    }
});

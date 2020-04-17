var actions = [{
        id: 0,
        text: 'Delete deal',
        keyBinding: ['⌘', 'A'],
        execute: () => console.log('a'),
    },
    {
        id: 1,
        text: 'Close deal',
        keyBinding: ['⌘', 'B'],
        execute: () => console.log('b'),
    },
    {
        id: 2,
        text: 'Re-open deal',
        keyBinding: ['⌘', 'C'],
        execute: () => console.log('c'),
    },
    {
        id: 3,
        text: 'eat potatoes',
        keyBinding: ['⌘', 'D'],
        execute: () => console.log('d'),
    },
    {
        id: 4,
        text: 'cook potatoes',
        keyBinding: ['⌘', 'E'],
        execute: () => console.log('e'),
    },
    {
        id: 5,
        text: 'buy potatoes',
        keyBinding: ['⌘', 'F'],
        execute: () => console.log('f'),
    },
    {
        id: 6,
        text: 'fly a kite',
        keyBinding: ['⌘', 'G'],
        execute: () => console.log('g'),
    },
    {
        id: 7,
        text: 'buy a bike',
        keyBinding: ['⌘', 'H'],
        execute: () => console.log('h'),
    },
    {
        id: 8,
        text: 'party time',
        keyBinding: ['⌘', 'I'],
        execute: () => console.log('i'),
    },
];

function fuzzy_match(str, pattern) {
    pattern = pattern.split("").reduce(function (a, b) {
        return a + ".*" + b;
    });
    return (new RegExp(pattern)).test(str);
};

var app = new Vue({
    el: '#app',
    data: {
        current: 0,
        open: false,
        seen: false,
        value: '',
        actionsList: actions,
    },
    computed: {
        matches: function () {
            this.current = 0;
            if (this.value && this.value !== '') {
                const results = fuzzysort.go(this.value, this.actionsList, {
                    key: 'text'
                });
                return results.map(
                    result => ({
                        ...this.actionsList[result.obj.id],
                        ...{
                            rendered: fuzzysort.highlight(result)
                        }
                    }))
            } else {
                return this.actionsList.map(
                    result => ({
                        ...result,
                        ...{
                            rendered: result.text
                        }
                    })
                )
            }
        },
    },
    methods: {
        scrollActionIntoview: function (index) {
            const matchId = this.matches[index].id;
            const selectedNode = this.$refs[`action${matchId}`];
            scrollIntoView(selectedNode[0], {
                behavior: 'smooth',
                scrollMode: 'if-needed'
            });
        },
        updateValue: function (value) {
            if (this.open === value) {
                this.open = true;
                this.current = 0
            }
            this.$emit('input', value);
            this.value = value
        },
        enter: function () {
            const selectedAction = this.matches[this.current];
            selectedAction.execute();
            this.open = false;
            this.seen = false;
        },
        up: function () {
            if (this.current > 0) {
                this.current--;
                this.scrollActionIntoview(this.current);
            }
        },
        down: function () {
            if (this.current < this.matches.length - 1) {
                this.current++;
                this.scrollActionIntoview(this.current);
            }
        },
        isActive: function (index) {
            return index === this.current
        },
        suggestionClick(index) {
            const selectedAction = this.matches[index];
            console.log(selectedAction.text);
            this.open = false;
            this.seen = false;
        },
    },
    mounted() {
        this._keyListener = function (e) {
            if (e.key === ' ' && e.ctrlKey) {
                e.preventDefault();
                this.seen = !this.seen
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                this.seen = false
            }
            if (this.seen === true) {
                this.$nextTick(function () {
                    this.$refs.search.focus()
                })
            } else {
                this.value = ''
            }
        };

        document.addEventListener('keydown', this._keyListener.bind(this));
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this._keyListener);
    },
});
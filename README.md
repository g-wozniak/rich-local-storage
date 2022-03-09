# rich-local-storage

If you are looking to enrich the standard web [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) with abilities to...
- store primitive data structures
- store JSON objects
- store arrays
- act as cache with automated expiry
- is compatible with JavaScript and TypeScript
- **work well and simple with ReactJS**

...this is your package to go for.

It's small, it's simple, it works.

## Quick guide

Using localStorage is about storing, retrieving, purging stored values and clearing the storage.

Optionally, you can use this package providing _expiry_ for stored items and calling `maintain()` which will automatically clear your storage from items that expired.

### store()
`store` allows you to push an *item* to the localStorage

    store = (key: string, item: StoredItem): void

providing the following data:

    type StoredItem = {
        expiry: number // amount of seconds from the moment the value is stored
        value: string | number | KeyAny | string[] | number[] | null // value you'd like to store
    }

Example usage:

    store('user', 
        expiry: 3600,
        value: {
            name: 'Anakin',
            surname: 'Skywalker'
        }
    )

**NOTE:** `expiry` should be a value in seconds from the moment the value was stored, after reaching which, it will be automatically purged

Example:

    store('arr', 
        expiry: 300,
        value: ['Wow', 'this']
    )

will keep the item alive for **300 seconds**. After that time, attempt of using `retrieve('arr')` will return `null`.


More usage examples in the [test file](https://github.com/g-wozniak/rich-local-storage/blob/main/test/index.test.ts) in the repository.

### retrieve()

Now, if you'd like to retrieve the stored value, (assuming its expiry didn't pass) 

    retrieve = (key: string): StoredItemValue | null

which in our case would be:

    retrieve('user') // that returns: { name: 'Anakin', surname: 'Skywalker' }


### maintain()

Maintain is used to control the _expiry_ of your item.

    maintain = (): void

If you don't call `maintain()` in your app then the items will be stored indefinitely (following the standard localStorage principles).

#### ReactJS support

If you intend to use this package in your React application, it is best to call the *maintain()* function just once, upon the component mount. 

Example:

    public componentDidMount(): void {
        maintain()
    }

or using hooks:

    useEffect(() => {
        maintain()
    }, [])

### purge()

You can purge the specific item in the storage:

    purge = (key: string): void

for example:

    purge('user')

### clear()

You can also clear the whole storage completely.

    clear = (): void

Example use:

    clear()

### Questions

Feel free to raise an issue in [Github Issues](https://github.com/g-wozniak/rich-local-storage/issues) of this package.
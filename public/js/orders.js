const user_id = 1

fetch(`/orders/${user_id}`)
    .then((res) => {
        res.json()
    })
    .then((data) => {
        
    })
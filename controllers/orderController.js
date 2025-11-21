import Order from "../models/order.js"

export async function createOrder(req,res){
    //CBC000001 -> first create order id

    // if(req.user == null){
    //     res.status(401).json(
    //         {
    //             message:"Unauthorized user"
    //         }
    //     )
    //     return
    // }

    try{
        const orderList = await Order.find().sort({date:-1}).limit(1)//order tika okkom aragen eyala sort karann ona anthim dawas udat ena vidiyt ethanim udam ek gannva4
        let newOrderID = "CBC0000001"

        if(orderList.length != 0){
            let lastOrderIDInString = orderList[0].orderID//string ekk vidiyt last order id ek gannva CBC0001234
            let lastOrderIDNumberInString = lastOrderIDInString.replace("CBC", "")//0001234 
            let lastOrderNumber = parseInt(lastOrderIDNumberInString)//1234
            let newOrderNumber = lastOrderNumber + 1; //1235
            //padStart
            let newOrderNumberInString = newOrderNumber.toString().padStart(7,"0")//0001235 ilakkam 7kt hadann madi evat 0 danna 
            
            newOrderID = "CBC" + newOrderNumberInString; //CBC0001235

        }
        const newOrder = new Order({
            orderID : newOrderID,
            items : [],
            customerName : req.body.customerName,
            email : req.body.email,
            phone : req.body.phone,
            address : req.body.address,
            total : req.body.total,
            status : "Pending"
        })

        const saveOrder = await newOrder.save()

        res.status(201).json(
            {
                message: "Order Created Successfully",
                order: saveOrder
            }
        )

    }catch(err){
        res.status(500).json(
            {
                message:"Internal server error"
            }
        )
    }
}
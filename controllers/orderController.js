import Order from "../models/order.js"
import Product from "../models/product.js"
import { isAdmin, isCustomer } from "./userController.js";

export async function createOrder(req, res) {
    //CBC000001 -> first create order id

    // if(req.user == null){
    //     res.status(401).json(
    //         {
    //             message:"Unauthorized user"
    //         }
    //     )
    //     return
    // }

    try {
        const user = req.user;//login user kenekt witharak order ek dann puluvam part ek
        if (user == null) {
            res.status(401).json(
                {
                    message: "Unauthorized user",
                }
            );
            return;
        }

        const orderList = await Order.find().sort({ date: -1 }).limit(1);//order tika okkom aragen eyala sort karann ona anthim dawas udat ena vidiyt ethanim udam ek gannva4
        let newOrderID = "CBC0000001";

        if (orderList.length != 0) {
            let lastOrderIDInString = orderList[0].orderID;//string ekk vidiyt last order id ek gannva CBC0001234
            let lastOrderNumberInString = lastOrderIDInString.replace("CBC", "");//0001234 
            let lastOrderNumber = parseInt(lastOrderNumberInString);//1234
            let newOrderNumber = lastOrderNumber + 1; //1235
            //padStart
            let newOrderNumberInString = newOrderNumber.toString().padStart(7, "0");//0001235 ilakkam 7kt hadann madi evat 0 danna 

            newOrderID = "CBC" + newOrderNumberInString; //CBC0001235

        }

        let customerName = req.body.customerName;//customer name ekt gann ona body eke dila thiyena name ek
        if (customerName == null) {//customer name ek nullnm first name last name ekathu karala custumer name ek hadagannva
            customerName = user.firstName + " " + user.lastName;
        }

        let phone = req.body.phone;//body eke thiyena phone number ek gannva
        if (phone == null) {//nullnm not provided kiyala penvanva
            phone = "Not Provided";
        }

        //checkout eke item array ek methanat enva
        const itemsInRequest = req.body.items;
        //check product ek aththatm thiyena ekkd kiyala balanva

        if (itemsInRequest == null) {
            res.status(400).json(
                {
                    message: "Items are required to place an order",
                }
            );
            return;
        }
        //array ekkd kiyala check karala balann ona
        if (!Array.isArray(itemsInRequest)) {
            res.status(400).json(
                {
                    message: "Item should be an array",
                }
            );
            return;
        }

        const itemsToBeAdded = [];//empty array ekk danva
        let total = 0;//total ek ganna use karanva

        //item ekem item ek check karanva
        for (let i = 0; i < itemsInRequest.length; i++) {
            const item = itemsInRequest[i];

            const product = await Product.findOne({ productID: item.productID });//1k hoyala denn me product id ekt gelepena
            //1 product ekkvath nathnm

            if (product == null) {
                res.status(400).json(
                    {
                        code: "not-found",//error code ekk gann vidiy
                        message: `Product with ID ${item.productID} not found`,
                        productID: item.productID,
                    }
                );
                return;
            }

            //quantity eka stock eke thiyenvad kiyala check karanva

            if (product.stock < item.quantity) {
                res.status(400).json(
                    {
                        code: "stock",
                        message: `Insufficient stock for product with ID ${item.productID}`,
                        productID: item.productID,
                        availableStock: product.stock,
                    }
                );
                return;
            }
            //item detatils push karanva
            itemsToBeAdded.push({
                productID: product.productID,
                quantity: item.quantity,
                name: product.name,
                price: product.price,
                image: product.images[0],
            });

            total += product.price * item.quantity

        }

        const newOrder = new Order({
            orderID: newOrderID,
            items: itemsToBeAdded,//items details thiyena array ek
            customerName: customerName,
            email: user.email,
            phone: phone,
            address: req.body.address,
            total: total,
        });

        const saveOrder = await newOrder.save();

        // for(let i=0; i<itemsToBeAdded.length; i++){
        //     const item = itemsToBeAdded[i]

        //     await Product.updateOne(//me product id ek thiyena kenage stock ek increment karann kiyala kiyanne 
        //         {productID: item.productID},
        //         {$inc: {stock: -item.quantity}}//$inc increment -> - agayakin increment karanne
        //     )
        // }

        //*****************uda thiyena short cut ek venuvat mek use karannath puluvam********** */

        // for(let i=0; i<itemsToBeAdded.length; i++){
        //     const item = itemsToBeAdded[i]

        //     const product = await Product.findOne({productID: item.productID})

        //     const newQty = product.stock - item.quantity

        //     await Product.updateOne(//me product id ek thiyena kenage stock ek increment karann kiyala kiyanne 
        //         {productID: item.productID},
        //         {stock: newQty }
        //     )
        // }

        res.status(201).json(
            {
                message: "Order Created Successfully",
                order: saveOrder,
            }
        );

    } catch (err) {
        res.status(500).json(
            {
                message: "Internal server error",
            }
        );
    }
}

export async function getOrders(req, res) {
    if (isAdmin(req)) {//customer admin keneknm
        const orders = await Order.find().sort({ date: -1 })//dine anith peththat ena vidiyt okkom order tika hoyala denna order tika
        res.json(orders);
    } else if (isCustomer(req)) {
        const user = req.user
        const orders = (await Order.find({ email: user.email })).toSorted({ date: -1 })
        res.json(orders)
    } else {
        res.status(403).json(
            {
                message: "You are not authorized to view orders"
            }
        )
    }
}

export async function updateOrderStatus(req, res) {
    if (!isAdmin(req)) {//check admin or not
        res.status(403).json({
            message: "You are not authorized to update order status",
        });
        return;
    }
    const orderID = req.params.orderID;
    const newStatus = req.body.status;
    try {
        await Order.updateOne(
            { orderID: orderID },
            { status: newStatus }
        );

        res.json({
            message: "Order status updated successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to update order status",
        });
        return;
    }
}
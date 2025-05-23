import { useContext, useActionState } from "react"
import Modal from "./UI/Modal"
import CartContext from "../store/CartContext"
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import UserProgressContext from "../store/UserProgressContext";
import Button from "./UI/Button";
import useHttp from "../hooks/useHTTP";
import Error from "./Error.jsx"

const requestConfig = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
}

const Checkout = () => {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const { data, error, sendRequest, clearData } = useHttp('http://localhost:3000/orders', requestConfig )

  const cartTotal=cartCtx.items.reduce((totalPrice, item)=> totalPrice + item.quantity * item.price, 0);

  const handleClose = () => {
    userProgressCtx.hideCheckout();
  }

  const handleFinish = () => {
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
  }

  const checkoutAction = async (prevState, fd) => {
    const customerData = Object.fromEntries(fd.entries()); //{emaill: test@example.com}

    sendRequest(JSON.stringify({
      order: {
        items: cartCtx.items,
        customer: customerData
      }
    }));
  }

  const [formsState, formAction, pending] = useActionState(checkoutAction, null )

  let actions = (
    <>
      <Button 
        type="button"
        textOnly
        onClick={handleClose}>Close</Button>
      <Button>Submit Order</Button>
    </>
  )

  if(pending) {
    actions = <span>Sending order data...</span>
  }

  if(data && !error) {
    return (
      <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleFinish}>
        <h2>Sucess!</h2>
        <p>Your order was submitted sucessfully</p>
        <p>You will receive a confirmation email with your order details.</p>
        <Button onClick={handleFinish}>Okay</Button>
      </Modal>
    )
  }

  return (
    <Modal 
      open={userProgressCtx.progress === 'checkout'}
      onClose={handleClose}>
      <form action={formAction}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

        <Input 
          label="Full Name"
          type="text"
          id="name"
        />
        <Input 
          label="Email Address"
          type="email"
          id="email"
        />
        <Input 
          label="Street"
          type="text"
          id="street"
        />
        <div className="control-row">
          <Input 
            label="Postal Code"
            type="text"
            id="postal-code"
          />
          <Input 
           label="City"
           type="text"
           id="city"
          />
        </div>
      {error && 
        <Error 
          title='Failed to submit order' 
          message={error}/>}
      
      <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
    
  )
}

export default Checkout
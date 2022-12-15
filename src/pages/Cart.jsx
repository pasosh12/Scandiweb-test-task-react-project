import React from "react";
import {mobile} from "../responsive";
import {connect} from "react-redux";
import CartItem from "../components/CartItem";
import CartItem2 from "../components/CartItem2";
import  '../styles/cart.css'
import NavbarContainer from "../components/NavbarContainer";

class Cart extends React.Component {


    render() {
        const totalPrices = [];
        let currentCurrencySymbol = ''
        let totalQuantityProducts = this.props.bagItems.map(item => item.quantity).reduce((prev, curr) => prev + curr, 0)
        console.log(this.props.bagItems)
        return (
            <div>
                <button onClick={this.props.clearBagItems}>удалить </button>
                <NavbarContainer/>
                <div className='main'>
                <div className='cartPage'>
                    <div className='myBag'>
                        <div>Cart</div>
                    </div>
                    <div className='items'>
                        {this.props.bagItems.map((item) => {
                            const currentCurrencyPrice = item.prices.find(
                                (currency) => currency.currency.label === this.props.currency);
                            currentCurrencySymbol = currentCurrencyPrice.currency.symbol

                            totalPrices.push(
                                Math.ceil(item.quantity * currentCurrencyPrice.amount)
                            );


                            return (

                                <CartItem key={item.id} price={currentCurrencyPrice} data={item} />
                                 );
                        })}
                    </div>
                    <div className='bottom'>
                        <div className='tax'> Tax 21%:
                            {/*<div>Tax 21%:</div>*/}
                            <span className='taxQuantityValue'>
                                {currentCurrencySymbol}
                                {totalPrices.reduce((prev, nxt) => prev + nxt, 0)*0.21}
                            </span>
                        </div>
                        <div className='quantity'> Quantity
                            {/*<div>Quantity</div>*/}
                            <span className='quantityValue'> {totalQuantityProducts}</span>
                        </div>
                        <div className='total'> Total :
                            {/*<span>Total:</span>*/}
                            {/*<div className='price'>*/}
                            <span>
                                {currentCurrencySymbol}
                                {totalPrices.reduce((prev, nxt) => prev + nxt, 0)}{" "}
                            </span>
                        </div>
                        <div className='buttons'>
                            <button className='checkout'>
                                ORDER
                            </button>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        );
    }
};
const mapStateToProps = (state) => {
    // console.log(state)
    return {
        bagItems: state.bag,
        currency: state.currency,

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeProductOptions: (productOption) =>
            dispatch({
                type: "PRODUCT_OPTIONS_UPDATE",
                productOptions: productOption,
            }),
        clearBagItems: () => dispatch({type: "CLEAR_BAG"}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);


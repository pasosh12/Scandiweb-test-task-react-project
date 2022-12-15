import React, {Component} from 'react'
// import ProductOptions from '../components/ProductOption'
import {gql} from "@apollo/client"
import {Query} from '@apollo/client/react/components'
import {store} from '../redux/store';
import {connect} from 'react-redux'
import '../styles/ProductDetailed.css'
import NavbarContainer from "../components/NavbarContainer";
// import AttributeItem from "../components/AttributeItem";
import AttributeProductPage from "../components/ProductPage/AttributeProductPage";


class ProductDetailed extends Component {
    constructor(props) {
        super(props)
        this.state = {
            productID: store.getState().productID,
            currency: store.getState().currency,
            imageIndex: 0
        }
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            this.setState({productID: store.getState().productID, currency: store.getState().currency})
        })
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    handleImage = (index) => {
        this.setState({imageIndex: index})
    }

    render() {
        const GET_DATA = gql`{
      product(id : ${JSON.stringify(this.state.productID)}){
        id
        name
        description
        brand
        inStock
        gallery
        prices{
          amount
          currency{
            label
            symbol
          }
        }
        attributes{
          id
          name
          type
          items{
            displayValue
            id
            value
          }
        }
      }
    }`;


        return (

            <Query query={GET_DATA}>
                {({data, loading, error}) => {

                    if (error) return <h1 style={{textAlign: "center", margin: "10rem"}}>An Error Occured.</h1>
                    if (loading) return <h1 style={{textAlign: "center", margin: "10rem"}}>Loading...</h1>

                    else {

                        const currentCurrencyPrice = data ? data.product.prices.find(currency => currency.currency.label === this.state.currency) : null
                        console.log(data.product)
                        return (
                            <>
                                <NavbarContainer/>
                                <div className='flex_product_block'>
                                <div className='product_pictures'>
                                        {
                                            data.product.gallery.map((image, index) => {
                                                return <img alt={image} src={image} key={image}
                                                            onClick={() => this.handleImage(index)}/>
                                            })
                                        }
                                    </div>
                                    <img className='main_img_product' src={data.product.gallery[this.state.imageIndex]}
                                         alt={data.product.name} height="400"/>
                                    <div className='description_product'>
                                        <div className='name_product'>{data.product.brand}</div>
                                        <div className='brand'>{data.product.name}</div>
                                        <div className='prise_title'>Price:</div>
                                        <div
                                            className='price'>{currentCurrencyPrice.currency.symbol}{currentCurrencyPrice.amount}</div>
                                        {/*<ProductOptions data={data.product}/>*/}

                                        {data.product.inStock ?
                                            <AttributeProductPage item={data.product}
                                                                  price={currentCurrencyPrice.amount}/>
                                            :
                                            <div className='outOfStock'>Out of stock</div>
                                        }

                                        <div className='text_description'
                                             dangerouslySetInnerHTML={{__html: data.product.description}}/>
                                    </div>
                                </div>
                                {/*{console.log(this.props)}*/}
                                {/*{*/}
                                {/*    this.state.flag.length*/}
                                {/*        ?*/}
                                {/*        <div className="overflow" onClick={(event) => event.target.className === "overflow" && this.setState({ flag: '' })}>*/}
                                {/*            <div className="img_and_close_block">*/}
                                {/*                /!*<img src={this.state.flag} />*!/*/}
                                {/*                /!*<div className="close" onClick={() => this.setState({ flag: '' })}>&#10006;</div>*!/*/}
                                {/*            </div>*/}
                                {/*        </div>*/}
                                {/*        : null*/}
                                {/*}*/}
                            </>
                        );
                    }
                }
                }
            </Query>
        )
    }
}

// export default GET_PRODUCTS(ProductDetailed)
export default connect(null)(ProductDetailed);
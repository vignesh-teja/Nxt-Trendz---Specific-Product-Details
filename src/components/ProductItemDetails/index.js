import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiConstantsValues = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetailsData: {},
    apiStatus: apiConstantsValues.initial,
    similarItemsList: [],
    productQuantity: 1,
  }

  componentDidMount() {
    this.getSpecificProductData()
  }

  getSpecificProductData = async () => {
    this.setState({apiStatus: apiConstantsValues.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const productData = {
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        title: fetchedData.title,
        price: fetchedData.price,
        description: fetchedData.description,
        brand: fetchedData.brand,
        totalReviews: fetchedData.total_reviews,
        rating: fetchedData.rating,
        availability: fetchedData.availability,
      }
      this.setState({productDetailsData: productData})
      const similarData = fetchedData.similar_products
      const similarItemsData = similarData.map(eachItem => ({
        id: eachItem.id,
        imageUrl: eachItem.image_url,
        title: eachItem.title,
        price: eachItem.price,
        description: eachItem.description,
        brand: eachItem.brand,
        totalReviews: eachItem.total_reviews,
        rating: eachItem.rating,
        availability: eachItem.availability,
      }))
      this.setState({similarItemsList: similarItemsData})
      console.log(productData)
      console.log('////')
      console.log(similarItemsData)
      this.setState({apiStatus: apiConstantsValues.success})
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiConstantsValues.failure})
    }
  }

  onIncrementQuantity = () => {
    this.setState(prevState => ({
      productQuantity: prevState.productQuantity + 1,
    }))
  }

  onDecrementQuantity = () => {
    const {productQuantity} = this.state
    if (productQuantity > 1) {
      this.setState(prevState => ({
        productQuantity: prevState.productQuantity - 1,
      }))
    }
  }

  onContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderProductDetails = () => {
    const {productDetailsData, similarItemsList, productQuantity} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = productDetailsData
    return (
      <div className="product-details-container">
        <div className="individual-product-details-container">
          <img
            src={imageUrl}
            className="individual-product-image"
            alt="product"
          />
          <div className="product-desc-cart-section">
            <h1 className="product-name">{title}</h1>
            <p className="product-price">RS {price}/-</p>
            <div className="review-section">
              <p className="product-rating review-star-container">
                {rating}
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-img"
                />
              </p>
              <p className="reviews-count">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <p className="product-availability">
              <span className="status">Available: </span>
              {availability}
            </p>
            <p className="product-brand">
              <span className="status">Brand: </span>
              {brand}
            </p>
            <hr className="seperator" />
            <div className="quantity-section">
              <button
                data-testid="minus"
                className="btn"
                type="button"
                onClick={this.onDecrementQuantity}
              >
                <BsDashSquare className="icon" />
              </button>
              <p className="product-quantity">{productQuantity}</p>
              <button
                data-testid="plus"
                className="btn"
                type="button"
                onClick={this.onIncrementQuantity}
              >
                <BsPlusSquare className="icon" />
              </button>
            </div>
            <button
              type="button"
              className="add-to-cart-btn"
              onClick={this.onAddtoCart}
            >
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-container">
          <h1 className="similar-products-heading">Similar Products</h1>
          <ul className="similar-products-ul">
            {similarItemsList.map(eachItem => (
              <SimilarProductItem
                similarItemDetails={eachItem}
                key={eachItem.id}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="api-failure-img"
        alt="failure view"
      />
      <h1 className="failure-view-heading">Product Not Found</h1>
      <button
        type="button"
        className="continue-shopping-btn"
        onClick={this.onContinueShopping}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderUI = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstantsValues.inProgress:
        return this.renderLoader()
      case apiConstantsValues.failure:
        return this.renderFailureView()
      case apiConstantsValues.success:
        return this.renderProductDetails()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderUI()}
      </>
    )
  }
}

export default ProductItemDetails

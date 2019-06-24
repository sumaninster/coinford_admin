<Menu.Item key="About">
  <Icon type="team" />
  <span className="nav-text">About</span>
</Menu.Item>
<Menu.Item key="Contact">
  <Icon type="customer-service" />
  <span className="nav-text">Contact</span>
</Menu.Item>
<Menu.Item key="Terms">
  <Icon type="solution" />
  <span className="nav-text">Terms</span>
</Menu.Item>
<Menu.Item key="Blog">
  <Icon type="contacts" />
  <span className="nav-text">Blog</span>
</Menu.Item>

<Menu.Item key="About">
  <Icon type="team" />
  <span className="nav-text">About</span>
</Menu.Item>
<Menu.Item key="Contact">
  <Icon type="customer-service" />
  <span className="nav-text">Contact</span>
</Menu.Item>
<Menu.Item key="Terms">
  <Icon type="solution" />
  <span className="nav-text">Terms</span>
</Menu.Item>
<Menu.Item key="Blog">
  <Icon type="contacts" />
  <span className="nav-text">Blog</span>
</Menu.Item>



class KYCMenu extends React.Component {
  constructor(props) {
    super(props)
    this.ApiCoinford = new ApiCoinford();
  }
  state = {
    current: 'Address',
  }
  handleClick = (e) => {
    this.ApiCoinford.setUiName(e.key)
    this.setState({
      current: e.key,
    });
    this.props.callback(e.key)
  }
  render() {
    return (
      <Menu theme="light" onClick={this.handleClick} mode="inline" defaultSelectedKeys={['Address']}>
        <Menu.Item key="Address">
          <Icon type="environment-o" />
          <span className="nav-text">Address</span>
        </Menu.Item>
        <Menu.Item key="Documents">
          <Icon type="upload" />
          <span className="nav-text">Documents</span>
        </Menu.Item>
        <Menu.Item key="Bank">
          <Icon type="bank" />
          <span className="nav-text">Bank</span>
        </Menu.Item>
      </Menu>
    );
  }
}

    KYCMenu: KYCMenu,

    import BuySell from './BuySell';
    import Wallet from './Wallet';
    import Payee from './Payee';
    import Transfer from './Transfer';
    import ForgotPassword from './ForgotPassword';
    import About from './About';
    import Contact from './Contact';
    import Terms from './Terms';
    import Blog from './Blog';
    import Profile from './Profile';

    case "Buy":
        this.ApiCoinfordAdmin.setOrderType("BUY")
        HomeForm = BuySell;
      break;
    case "Sell":
        this.ApiCoinfordAdmin.setOrderType("SELL")
        HomeForm = BuySell;
      break;
    case "Wallet":
        HomeForm = Wallet;
      break;
    case "Payee":
        HomeForm = Payee;
      break;
    case "Transfer":
        HomeForm = Transfer;
      break;

      /*var DisplayName;
      if(this.ApiCoinfordAdmin.isAdminLogin()) {
        DisplayName = this.ApiCoinfordAdmin.AdminName + ' (' + this.ApiCoinfordAdmin.AdminGroup.Name + ')';
      }*/

      switch (this.ApiCoinfordAdmin.getUiName()) {
        case "About":
            HomeForm = About;
          break;
        case "Contact":
            HomeForm = Contact;
          break;
        case "Terms":
            HomeForm = Terms;
          break;
        case "Blog":
            HomeForm = Blog;
          break;
        default:
      }

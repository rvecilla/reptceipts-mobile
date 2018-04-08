import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import { Heading, Subtitle, Button, Text as ButtonText, Row, Icon, ListView, Caption, View } from '@shoutem/ui';
import Moment from 'react-moment';

import Loader from '../Helpers/Loader';
import { withNavigationFocus } from '@patwoz/react-navigation-is-focused-hoc';
import SearchInput, { createFilter } from 'react-native-search-filter';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as receiptActions from '../../Actions/Receipt';
import * as userActions from '../../Actions/User';
import * as UIActions from '../../Actions/UI';

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

const KEYS_TO_FILTERS = ['retailer_name', 'subtotal'];

class Receipts extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: ''
    };
    this.renderRow = this.renderRow.bind(this);
    this.searchUpdated = this.searchUpdated.bind(this);

  }

  searchUpdated(term) {
    this.setState({ searchTerm: term });
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isFocused && nextProps.isFocused) {
      this.props.userActions.getUserReceipts();
    }
  }

  componentWillMount() {
    this.props.userActions.getUserReceipts();
  }

  onPressReceipt = (receipt) => { 
    this.props.navigation.navigate('SoloReceipt', { id: receipt.id });
  }

  renderRow(receipt) {
    return (
      <TouchableOpacity onPress={() => this.onPressReceipt(receipt)} >
        <Row>
          <View styleName="vertical stretch space-between">
            <Subtitle>{receipt.retailer_name}</Subtitle>
            <Caption>Subtotal: {receipt.subtotal} &#183; <Moment element={Caption} format="DD MMMM YYYY">{receipt.created_at}</Moment></Caption>
          </View>
          <Icon styleName="disclosure" name="right-arrow" />
        </Row>
      </TouchableOpacity>
    );
  }

  render() {
    
    if (typeof this.props.receipts === 'undefined') {
      return false;
    }

    const receipts = this.props.receipts;

    if (isEmpty(receipts)) {
      return (
        <View>
          <Heading styleName="md-gutter">No receipts found</Heading>
        </View>
      )
    }

    let filteredReceipts = [];
    if (receipts) {
      filteredReceipts = receipts.filter(
        createFilter(this.state.searchTerm, KEYS_TO_FILTERS)
      );
	}
	
    return (
      <View>
      <Loader
          loading={this.props.loading ? this.props.loading : false} />

		{ this.props.displaySearch ? 
			<SearchInput 
				onChangeText={(term) => { this.searchUpdated(term) }}
				style={styles.searchInput}
				placeholder="Search receipts"
			/>
		:
			false
		}
        {!isEmpty(filteredReceipts) ? (
          <ListView
            data={filteredReceipts}
            renderRow={this.renderRow}
          />
        ) : (
          <Subtitle styleName="md-gutter">Could not find that receipt!</Subtitle>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  searchInput:{
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1
  }
});

function mapStateToProps(state) {
  return {
    loading: state.ui.loading,
    receipts: state.user.receipts,
    displaySearch: state.ui.displaySearch
  };
}

function mapDispatchToProps(dispatch) {
  return {
    receiptActions: bindActionCreators(receiptActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
    UIActions: bindActionCreators(UIActions, dispatch)
  };
}


export default withNavigationFocus(connect(mapStateToProps, mapDispatchToProps)(Receipts));
<div class="saved-addresses">
    <h4 class="saved-addresses__heading">Choose a Billing Address:</h4>
    <div class="saved-addresses__addresses">
		<div class="saved-addresses__address-block" v-for="(saved_address,index) in saved_addresses" :key="index">
			<div class="saved-address"  v-on:click.prevent="activateSavedAddress(index)">
				<div class="saved-address__content">
					<div class="saved-address__detail">
						<div class="saved-address__detail__input">
							<label :for="'address_active_'+index" class="usfsa-checkbox" v-if="saved_address_count>1">
								<input type="checkbox" :id="'address_active_'+index" :checked="isActive(index)" :value="index">
								<span class="usfsa-checkbox__text"><span class="sr-only">Select this address</span></span>
							</label>
						</div>
						<address class="checkout-address saved-address__detail__address">
							<span>{{saved_address.full_name}}</span>
							<span>{{saved_address.street}}</span>
							<span v-if="saved_address.street_2">{{saved_address.street_2}}</span>
							<span>{{saved_address.city_state_zip}}</span>
						</address>
					</div>
					<div class="checkout-step__actions  saved-addresses__actions" v-if="isActive(index)">
						<div class="saved-addresses__actions__use">
							<button v-on:click.prevent="selectSavedAddress(index)" type="button" class="button button--action button--block">
								Use this Address
							</button>
						</div>
						<div class="saved-addresses__actions__edit">
							<button type="button" v-on:click.prevent="edit(index)" class="button button--info button--block">Edit</button>
						</div>
					</div>
				</div>
			</div>
		</div>
    </div>
    <div class="saved-addresses__add">
        <a href="#" v-on:click.prevent="addAddress()" class="standard-link">Add New Address</a>
    </div>
</div>
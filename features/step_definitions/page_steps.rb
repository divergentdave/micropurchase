When(/^I refresh the page$/) do
  visit page.current_path
end

When(/^I click on the "?([^"]+)"? button$/) do |button|
  first(:link_or_button, button).click
end

When(/^I click on the "([^"]+)" link$/) do |label|
  click_on(label)
end

When(/^I click on the auction's title$/) do
  click_on(@auction.title)
end

Then(/^I should see an? (.+) label$/) do |label|
  within(:css, 'div.issue-list-item') do
    within(:css, 'span.usa-label-big') do
      expect(page).to have_content(label)
    end
  end
end

Then(/^I should see "(.+)"$/) do |text|
  expect(page).to have_content(text)
end

Then(/^I should not see "(.+)"$/) do |text|
  expect(page).to_not have_content(text)
end

Then(/^I should see an? "([^"]+)" button$/) do |button|
  expect(page).to have_selector(:link_or_button, button)
end

Then(/^I should not see an? "([^"]+)" button$/) do |button|
  expect(page).to_not have_selector(:link_or_button, button)
end

When(/^I visit my bids page$/) do
  visit my_bids_path
end

When(/^I visit my profile page$/) do
  @user = User.find_by(github_id: @github_id)
  visit users_edit_path
end

Then(/^I should be on the home page$/) do
  expect(page.current_path).to eq("/")
end

Then(/^I should be on the auction page$/) do
  expect(page.current_path).to eq(auction_path(@auction))
end

Then(/^I should be on my profile page$/) do
  expect(page.current_path).to eq(users_edit_path)
end

Then(/^I should be on the new bid page$/) do
  expect(page.current_path).to eq(new_auction_bid_path(@auction))
end

Then(/^I should be on the bid confirmation page$/) do
  expect(page.current_path).to eq(confirm_auction_bids_path(@auction))
end

Then(/^there should be meta tags for the edit profile form$/) do
  expect(page).to have_css("title", visible: false, text: "18F Micro-purchase - Edit user: #{@user.name}")
end

Then(/^there should be meta tags for the closed auction$/) do
  pr_auction = AuctionPresenter.new(@auction)

  expect(page).to have_css("title", visible: false, text: "18F Micro-purchase - #{pr_auction.title}")
  expect(page).to have_css("meta[property='og:title'][content='18F Micro-purchase - #{pr_auction.title}']", visible: false)
end

Then(/^there should be meta tags for the open auction$/) do
  pr_auction = AuctionPresenter.new(@auction)

  expect(page).to have_css("title", visible: false, text: "18F Micro-purchase - #{pr_auction.title}")
  expect(page).to have_css("meta[property='og:title'][content='18F Micro-purchase - #{pr_auction.title}']", visible: false)
end

# FIXME
Then(/^there should be meta tags for the index page for (\d+) open and (\d+) future auctions$/) do |open_count, future_count|
  expect(page).to have_css("title", visible: false, text: "18F - Micro-purchase")
  expect(page).to have_css("meta[property='og:title'][content='18F - Micro-purchase']", visible: false)
  expect(page).to have_css("meta[name='description'][content='The Micro-purchase Marketplace is the place to bid on open-source issues from the 18F team.']", visible: false)
  expect(page).to have_css("meta[property='og:description'][content='The Micro-purchase Marketplace is the place to bid on open-source issues from the 18F team.']", visible: false)
  expect(page).to have_css("meta[name='twitter:label1'][value='Active Auctions']", visible: false)
  expect(page).to have_css("meta[name='twitter:data1'][value='#{open_count}']", visible: false)
  expect(page).to have_css("meta[name='twitter:label2'][value='Coming Auctions']", visible: false)
  expect(page).to have_css("meta[name='twitter:data2'][value='#{future_count}']", visible: false)
end

Then(/^I should see a link to (single-bid|multi-bid) rules$/) do |rules|
  case rules
  when 'single-bid'
    expect(page).to have_content("Single-bid")
  when 'multi-bid'
    expect(page).to have_content("Multi-bid")
  else
    fail "Unrecognized auction type: #{rules}"
  end
end

Then(/^I should see the rules for (single-bid|multi-bid) auctions$/) do |type|
  expect(page).to have_content("Rules for #{type} auctions")
end
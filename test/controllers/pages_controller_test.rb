require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "homepage renders" do
    get root_url
    assert_response :success
    assert_match "Ahmed Loudghiri", response.body
  end

  test "about page renders" do
    get about_url
    assert_response :success
  end

  test "projects page renders" do
    get projects_url
    assert_response :success
  end

  test "experiments page renders" do
    get experiments_url
    assert_response :success
  end
end

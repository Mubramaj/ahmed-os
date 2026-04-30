require "test_helper"

class WritingControllerTest < ActionDispatch::IntegrationTest
  test "index lists only published posts" do
    get writing_index_url
    assert_response :success

    assert_match posts(:published_one).title, response.body
    assert_match posts(:published_two).title, response.body
    assert_no_match Regexp.new(Regexp.escape(posts(:draft_one).title)), response.body
  end

  test "show finds a published post by slug" do
    get writing_url(slug: posts(:published_one).slug)
    assert_response :success
    assert_match posts(:published_one).title, response.body
  end

  test "show 404s for a draft slug" do
    get writing_url(slug: posts(:draft_one).slug)
    assert_response :not_found
  end

  test "show 404s for an unknown slug" do
    get writing_url(slug: "does-not-exist")
    assert_response :not_found
  end
end

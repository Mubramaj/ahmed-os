module Admin
  # All admin controllers inherit from this base.
  # Authentication is enforced here so no individual admin controller
  # can accidentally skip it.
  class BaseController < ApplicationController
    include Authentication

    layout "admin"
  end
end

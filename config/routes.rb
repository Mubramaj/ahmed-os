Rails.application.routes.draw do
  # Public site
  root "pages#home"
  get "about",       to: "pages#about",       as: :about
  get "projects",    to: "pages#projects",    as: :projects
  get "experiments", to: "pages#experiments", as: :experiments

  # Public writing surface (slug-based)
  get "writing",       to: "writing#index", as: :writing_index
  get "writing/:slug", to: "writing#show",  as: :writing

  # Admin: login lives at /admin/session, protected CRUD at /admin/posts
  namespace :admin do
    resource  :session,   only: %i[new create destroy]
    resources :passwords, param: :token, only: %i[new create edit update]
    resources :posts
    root to: "posts#index"
  end

  # Health check used by load balancers and uptime monitors.
  get "up" => "rails/health#show", as: :rails_health_check

  # Future PWA hooks (kept commented like the default scaffold):
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
end

# Public, mostly-static pages that frame the personal site.
#
# These pages don't depend on user input. They render quickly and remain
# crawlable so the skippable intro never blocks SEO.
class PagesController < ApplicationController
  # Homepage: hero, current focus, featured writing, featured projects.
  def home
    @featured_posts    = Post.published.recent.limit(3)
    @featured_projects = featured_projects
  end

  # /about
  def about
  end

  # /projects (placeholder until real project entries land)
  def projects
    @projects = featured_projects
  end

  # /experiments (placeholder for future interactive demos)
  def experiments
  end

  private

  # Hardcoded featured projects for now. When projects become a real model
  # this method will be replaced with a query. Keeping it in one place makes
  # that swap trivial.
  def featured_projects
    [
      {
        name: "ToutiGame",
        tagline: "A games platform built around play, identity, and ownership.",
        status: "Building"
      },
      {
        name: "Personal OS",
        tagline: "This site. A live operating system for writing, projects, and experiments.",
        status: "Always evolving"
      },
      {
        name: "AI side-builds",
        tagline: "Small AI products at the edge of product, infra, and design.",
        status: "Exploring"
      }
    ]
  end
end

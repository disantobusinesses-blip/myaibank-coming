  useEffect(() => {
    // Wait until demo mode check is complete (isDemoMode is not null)
    if (isDemoMode === null) return

    // Skip ALL auth redirects if in demo mode
    if (isDemoMode === true) return

    // Only redirect if NOT in demo mode
    if (!loading && !user) {
      router.push("/login")
    } else if (!loading && user && profile && !profile.is_onboarded) {
      router.push("/onboarding")
    }
  }, [user, profile, loading, router, isDemoMode])

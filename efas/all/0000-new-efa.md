---
authors: Your Name <your.email@chainguard.dev>
state: draft
discussion:
---

# EFA 0000: [Title - Brief, Descriptive Name for Your Explainer]

<!--
Welcome to the EFA template! This document will guide you through writing an Explainer For Agents.

EFAs are designed to help AI agents understand complex systems, processes, and architectural decisions.
They serve as comprehensive documentation that agents can reference when working on related tasks.

Delete all the comments (like this one) when you're done filling out the template.
-->

## Motivation & Prior Art

<!--
Write a few paragraphs that summarize the system, process, or architecture being explained.
Someone (especially an AI agent) should be able to read just this section and understand
what you're documenting at a high level.

Example: "This EFA explains our caching layer implementation in the API gateway, how it reduces
database load and improves response times for frequently accessed resources. (...)"

This section should provide clear context about why this system/process exists and what it accomplishes.

Include:
- What were we doing before now?
- Why are we doing this? What problem are you trying to solve?
- What use cases does it support? What is the expected outcome?
- What happens if we don't do this now?
- What are the Goals and/or Non-goals?
-->

## Detailed Design

<!--
This is the meat of the EFA. Explain the design in enough detail that:
1. Someone could implement it
2. Reviewers can identify potential issues
3. It's clear how this integrates with existing systems

Include:
- Architecture diagrams (use ASCII art or link to images)
- API specifications
- Data models
- Algorithms
- Dependencies
-->

<!--
The specific subsections in Detailed Design will vary depending on the goal of your EFA.
Choose the sections that best explain the system or process. Common sections include:

- **Architecture Overview**: For explaining system designs, services, or architectural patterns
  Example: EFA documenting the microservice architecture or event-driven system

- **Implementation Details**: For explaining algorithms, complex logic, or technical deep-dives
  Example: EFA explaining the compression algorithm or cache invalidation strategy

- **API Specifications**: For documenting external or internal APIs, REST endpoints, or GraphQL schemas
  Example: EFA documenting API versioning strategy or customer-facing endpoints

- **Entities & Data Structures**: For documenting database schemas, data models, or storage formats
  Example: EFA explaining the data model for user permissions or event storage

- **Examples**: For any EFA - concrete scenarios help agents understand how things work
  Example: Step-by-step walkthroughs of user workflows or system interactions

- **Protocol Specification**: For documenting communication protocols, message formats, or integration patterns
  Example: EFA explaining the webhook delivery mechanism or inter-service protocol

- **Migration History**: For documenting how systems evolved or were migrated
  Example: EFA documenting the migration from PostgreSQL to DynamoDB

Add your chosen sections below:
-->

<!--
### Examples

Show concrete examples of how this will work in practice.
Walk through user scenarios step-by-step.
Include both common cases and edge cases.

Example:
"When a user requests their profile data:
1. Request hits the API gateway
2. Gateway checks cache with key `user:profile:{id}`
3. If cache hit and age < 5 minutes, return cached data
4. If cache miss or stale, fetch from database
5. Update cache with 5-minute TTL
6. Return data to user"
-->

### Why This Design?

<!--
Summarize why this design is the best choice given the constraints and requirements.

Every design decision has trade-offs. Be honest about them.

Examples:
- Complexity vs Performance: This adds operational complexity but reduces latency by 80%
- Memory vs CPU: We're trading 2GB of memory for 50% CPU reduction
- Development time vs Features: Implementing this will delay Feature X by 2 weeks
-->


### Alternatives Considered

<!--
What other approaches did you consider? Why did you reject them?
This shows you've thought through the problem space and helps the agent
avoid reinventing the wheel when it thinks it sees a better or more
clever way to solve the problem

For each alternative, explain:
- What it was
- Why it might be good
- Why you decided against it
-->


## Implications for Cross-cutting Concerns

<!--
Summarize what i

Every design decision has one or more cross-cutting concerns that it will impact. Complete the checklist below. For each box checked, you must include a section to address the implication.
-->

- [ ] Security Implications
- [ ] Performance Implications
- [ ] Testing Implications

<!--
## Security Implications

Address:
- Authentication/Authorization changes
- Data privacy concerns
- Potential attack vectors
- Compliance requirements (GDPR, SOC2, etc.)
- Secrets management
- Network security boundaries

If there are no security implications, explicitly state that and explain why.
-->

<!--
## Performance Implications

How will this affect system performance? What does the Agent need to now be mindful of?

Consider:
- Latency impacts (positive or negative)
- Throughput changes
- Resource usage (CPU, memory, disk, network)
- Scalability limits
- Performance under failure conditions

Include benchmark data if available.
-->

<!--
## Testing Concerns

How will we test this? Does any future Agent now need to write an additional test?

Include:
- Unit test approach
- Integration test requirements
- Performance/load testing plans
- Failure scenario testing
- Rollback testing
- Monitoring and alerting changes
-->

## Open Questions

<!--
What questions will still be unanswered?
What decisions are you seeking input on?

n.b. typically you will remove this section before merge

Number them for easy reference in discussions:
1. Should we use Redis or Memcached for the cache layer?
2. What should the default TTL be?
3. Should this be enabled by default or opt-in?
-->

## References

<!--
Links to relevant external resources, papers, similar implementations, etc.

Examples:
- [RFC 7234: HTTP Caching](https://tools.ietf.org/html/rfc7234)
- [Similar implementation in Project X](https://github.com/...)
- [Internal design doc](https://docs.internal/...)
-->

---

## Checklist

<!--
Before finalizing this EFA, ensure you've addressed:

- Author
  - [ ] The problem is clearly stated
  - [ ] The solution is well-defined
  - [ ] Security implications are considered
  - [ ] Performance impacts are analyzed
  - [ ] The implementation is feasible
  - [ ] Trade-offs are honestly discussed
  - [ ] The scope is appropriate (not too big, not too small)
  - [ ] Examples make the abstract concrete
  - [ ] The document is readable by the target audience
- Reviewers
  - [ ] The problem warrants the proposed solution
  - [ ] The design is technically sound
  - [ ] Security concerns are adequately addressed
  - [ ] The implementation plan is realistic
  - [ ] The EFA is clear and well-organized
-->

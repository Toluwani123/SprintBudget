import React, {useState, useEffect} from 'react'
import {api} from '../api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import { useSonner } from 'sonner'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import {Switch} from '@/components/ui/switch'
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs'
import {usePlaidLink} from 'react-plaid-link'
import DashboardNav from '@/components/DashboardNav'
import { Loader2 } from 'lucide-react'



function Settings() {

    const [userData, setUserData] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    
    const [linkToken, setLinkToken] = useState(null);
    const [error, setError] = useState(null);
    const { toast } = useSonner();
    const [form, setForm] = useState({
        email: '',
        username: '',
        weekly_budget: '',
        currency: 'USD',
        ai_features_enabled: false,
        rollover_budget: false,
    });

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                const { data } = await api.get('/accounts/profile/update/');
                setUserData(data);                 // keep if you still need raw data
                setForm({
                    email: data.email,
                    username: data.username,
                    weekly_budget: String(data.weekly_budget ?? ''),
                    currency: (data.currency || 'USD').toUpperCase(),
                    ai_features_enabled: data.ai_features_enabled,
                    rollover_budget: data.rollover_budget,
                });
                console.log('User data:', data);
            } catch {
            toast.error('Failed to fetch user data');
            } finally {
            setIsLoading(false);
            }
        };

        fetchUserData();
    }, [toast]);


    useEffect(() => {
        getLinkToken().catch(error => {
          console.error('Error fetching link token:', error);
        });
    }, []);

    const { open, ready } = usePlaidLink({
        
        token: linkToken,
        onSuccess: async (public_token, metadata) => {
            const institutionId = metadata.institution?.institution_id ?? null;
            try {
            await api.post("/integrations/plaid/exchange-token/", {
                public_token,
                institution_id: institutionId,
            });
            // success handling here
            alert("Plaid integration successful!");
            } catch (err) {
            console.error(
                "Exchange-token error:",
                err.response?.data || err.message
            );
            alert(
                JSON.stringify(err.response?.data ?? err.message, null, 2)
            );
            }
        },
        onExit: (error, metadata) => {
            if (error) console.error("User exited Plaid Link with error:", error);
        },
    });


    const getLinkToken = async () => {
        try {
        const response = await api.post('/integrations/plaid/link-token/');
            if (response.status === 200) {
            setLinkToken(response.data.link_token);
            }
        } catch (error) {
        console.error('Error fetching link token:', error);
        return null;
        }
    }
    const testTransactions = async () => {
        try {
          const response = await api.post('/integrations/plaid/sync/');
          if (response.status === 200) {
            alert('Test transactions created successfully!');
          }
        } catch (error) {
          console.error('Error creating test transactions:', error);
          alert('Failed to create test transactions.');
        }
    } 
    const testSprints = async () => {
        try {
          const response = await api.get('/sprints/current/');
          if (response.status === 200) {
            alert('Test sprints created successfully!');
          }
        } catch (error) {
          console.error('Error creating test sprints:', error);
          alert('Failed to create test sprints.');
        }
    }
    const handleSave = async (e) => {
        e.preventDefault();                 // stop page reload
        setIsLoading(true);
        try {
            // convert number inputs to actual numbers before sending
            const payload = {
            ...form,
            weekly_budget: Number(form.weekly_budget) || 0,
            currency: form.currency.toUpperCase(),
            };

            await api.put('/accounts/profile/update/', payload);
            
        } catch (err) {
            if (err.response?.data) {
            // Show first field error (or customise as you like)
                console.error('Error updating profile:', err.response.data);
            } else {
                console.error('Error updating profile:', err);
            }
            console.error('Error updating profile:', err.response?.data || err);
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <div className='container mx-auto px-4 py-6'>
        <DashboardNav userData={userData} />
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>
                    Settings
                </h1>
                <p className='text-muted-foreground'>
                    Manage your account settings and preferences.
                </p>

            </div>

        </div>
        <Tabs defaultValue="profile" className="mt-6">
            <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className='space-y-6'>
                <form onSubmit={handleSave} className='space-y-4'>
                    <div className='space-y-4'>
                        <h2 className='text-xl font-semibold'>Profile Settings</h2>
                        
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <Label htmlFor='email'>Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        value={form.username}
                                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                                        placeholder={ "Enter your username"}
                                    />
                                </div>
                                
                                
                            
                            </div>
                            

                    </div>
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Budget Settings</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="weekly-budget">Weekly Budget</Label>
                            <Input
                                id="weekly-budget"
                                type="number"
                                value={form.weekly_budget}
                                onChange={(e) => setForm({ ...form, weekly_budget: e.target.value })}
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Select
                                value={form.currency}
                                onValueChange={(v) => setForm({ ...form, currency: v })}
                                
                            >
                                <SelectTrigger id="currency">
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USD">USD ($)</SelectItem>
                                    <SelectItem value="EUR">EUR (€)</SelectItem>
                                    <SelectItem value="GBP">GBP (£)</SelectItem>
                                    <SelectItem value="CAD">CAD ($)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ai-features">AI Features Enabled</Label>
                            <div className="flex items-center space-x-2 pt-2">
                            <Switch
                                id="ai-features"
                                checked={form.ai_features_enabled}
                                onCheckedChange={(v) => setForm({ ...form, ai_features_enabled: v })}
                            />
                            <Label htmlFor="ai-features">Enable AI Features</Label>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rollover">Rollover Unspent Budget</Label>
                            <div className="flex items-center space-x-2 pt-2">
                            <Switch
                                id="rollover"
                                checked={form.rollover_budget}
                                onCheckedChange={(v) => setForm({ ...form, rollover_budget: v })}
                            />
                            <Label htmlFor="rollover">Enable rollover</Label>
                            </div>
                        </div>
                        </div>
                    </div>
                    <Button type="submit" className="mt-4" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </form>

                
                
            </TabsContent>
            <TabsContent value="billing">
                <div>Billing content coming soon...</div>
            </TabsContent>
            <TabsContent value="integrations" className="space-y-6">
                <div className='space-y-4'>
                    <h2 className="text-xl font-semibold">Connected Services</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                            <Label>Plaid</Label>
                            <p className="text-sm text-muted-foreground">Connect your bank accounts</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => open()} disabled={!ready}>
                                Connect
                            </Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                            <Label>Transaction Fetch</Label>
                            <p className="text-sm text-muted-foreground">Fetch latest transactions</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={testTransactions}>
                            Fetch
                            </Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                            <Label>Run Important functions</Label>
                            <p className="text-sm text-muted-foreground">Sync up your dashboard</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={testSprints}>
                            Run
                            </Button>
                        </div>
                    </div>


                </div>
            </TabsContent>
            <TabsContent value="notifications">
                <div className='space-y-4'>
                    <h2 className="text-xl font-semibold">Notification Settings</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive email updates</p>
                            </div>
                            <Switch
                                checked={userData?.email_notifications}
                                onCheckedChange={async (checked) => {
                                    try {
                                        await api.put('/accounts/profile/update/', { email_notifications: checked });
                                        setUserData({ ...userData, email_notifications: checked });
                                    } catch (error) {
                                        console.error('Error updating email notifications:', error);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </TabsContent>
            
        </Tabs>
    </div>
  )
}

export default Settings